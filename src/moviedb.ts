// In-memory ad-hoc movie database.

type Movie = {
  title: string;
  year?: number;
  director: Director;
  cast?: Actor[];
};

type Director = {
  name: string;
  movies?: Movie[];
};

type Actor = {
  name: string;
  movies?: Movie[];
};

export const movies: Movie[] = [];

export const directors: Director[] = [];

export const actors: Actor[] = [];

export function printDB() {
  const db = {
    movies,
    directors,
    actors,
  };
  console.log(JSON.stringify(db, null, 4));
}
