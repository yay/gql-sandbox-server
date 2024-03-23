import { hash } from './hash';
import { QueryResolvers, Resolvers } from './generated/graphql';
import { delay } from './delay';

const createDog = (breed: string, subBreeds: string[]) => ({
  breed,
  id: hash(breed),
  subBreeds: subBreeds.length > 0 ? subBreeds : null,
});

const API = 'https://dog.ceo/api';

export const dogResolvers: Resolvers = {
  Dog: {
    displayImage: async ({ breed }, parent, context) => {
      const results = await fetch(`${API}/breed/${breed}/images/random`);
      const { message: image } = (await results.json()) as { message: string };
      await delay();
      return image;
    },
    images: async ({ breed }, parent, context) => {
      const results = await fetch(`${API}/breed/${breed}/images`);
      const { message: images } = (await results.json()) as {
        message: string[];
      };
      await delay();
      return images.map((image) => ({ url: image, id: hash(image) }));
    },
  },
};

export const dogQueryResolvers: QueryResolvers = {
  dogs: async (parent, args, context, info) => {
    const response = await fetch(`${API}/breeds/list/all`);
    const { message: breedToSubBreedsMap } = (await response.json()) as {
      message: { [breed: string]: string[] };
    };

    const breeds = Object.keys(breedToSubBreedsMap);
    const dogs = breeds.map((breed) =>
      createDog(breed, breedToSubBreedsMap[breed]),
    );
    return dogs;
  },
  dog: async (parent, { breed }) => {
    const response = await fetch(`${API}/breed/${breed}/list`);
    const { message: subBreeds } = (await response.json()) as {
      message: string[];
    };
    return createDog(breed, subBreeds);
  },
};
