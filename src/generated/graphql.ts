import { GraphQLResolveInfo } from 'graphql';
import { SandboxContext } from '../app';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type CreateFolderInput = {
  fileSystemId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  parentId: Scalars['String']['input'];
};

export type Dog = {
  __typename?: 'Dog';
  breed: Scalars['String']['output'];
  displayImage?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<Maybe<Image>>>;
  subbreeds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Finance = {
  __typename?: 'Finance';
  crumb?: Maybe<Scalars['String']['output']>;
};

export type Folder = {
  __typename?: 'Folder';
  children?: Maybe<Array<Folder>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFolder?: Maybe<Folder>;
};


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};

export type NetworkingList = {
  __typename?: 'NetworkingList';
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  networkingListEntriesData: NetworkingListEntriesData;
};


export type NetworkingListNetworkingListEntriesDataArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<NetworkingListEntriesSort>>;
};

export type NetworkingListEntriesData = {
  __typename?: 'NetworkingListEntriesData';
  data?: Maybe<Array<NetworkingListEntry>>;
  totalCount: Scalars['Int']['output'];
};

export type NetworkingListEntriesSort = {
  field: NetworkingListEntriesSortField;
  order: SortOrder;
};

export enum NetworkingListEntriesSortField {
  CreatedDate = 'CREATED_DATE',
  Location = 'LOCATION',
  Name = 'NAME'
}

export type NetworkingListEntry = {
  __typename?: 'NetworkingListEntry';
  createdDate?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  dog?: Maybe<Dog>;
  dogs?: Maybe<Array<Maybe<Dog>>>;
  finance?: Maybe<Finance>;
};


export type QueryDogArgs = {
  breed: Scalars['String']['input'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  CreateFolderInput: CreateFolderInput;
  Dog: ResolverTypeWrapper<Dog>;
  Finance: ResolverTypeWrapper<Finance>;
  Folder: ResolverTypeWrapper<Folder>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NetworkingList: ResolverTypeWrapper<NetworkingList>;
  NetworkingListEntriesData: ResolverTypeWrapper<NetworkingListEntriesData>;
  NetworkingListEntriesSort: NetworkingListEntriesSort;
  NetworkingListEntriesSortField: NetworkingListEntriesSortField;
  NetworkingListEntry: ResolverTypeWrapper<NetworkingListEntry>;
  Query: ResolverTypeWrapper<{}>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateFolderInput: CreateFolderInput;
  Dog: Dog;
  Finance: Finance;
  Folder: Folder;
  ID: Scalars['ID']['output'];
  Image: Image;
  Int: Scalars['Int']['output'];
  Mutation: {};
  NetworkingList: NetworkingList;
  NetworkingListEntriesData: NetworkingListEntriesData;
  NetworkingListEntriesSort: NetworkingListEntriesSort;
  NetworkingListEntry: NetworkingListEntry;
  Query: {};
  String: Scalars['String']['output'];
};

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']['input']>;
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = SandboxContext, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DogResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['Dog'] = ResolversParentTypes['Dog']> = {
  breed?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['Image']>>>, ParentType, ContextType>;
  subbreeds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FinanceResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['Finance'] = ResolversParentTypes['Finance']> = {
  crumb?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FolderResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['Folder'] = ResolversParentTypes['Folder']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Folder']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createFolder?: Resolver<Maybe<ResolversTypes['Folder']>, ParentType, ContextType, RequireFields<MutationCreateFolderArgs, 'input'>>;
};

export type NetworkingListResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['NetworkingList'] = ResolversParentTypes['NetworkingList']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  networkingListEntriesData?: Resolver<ResolversTypes['NetworkingListEntriesData'], ParentType, ContextType, Partial<NetworkingListNetworkingListEntriesDataArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NetworkingListEntriesDataResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['NetworkingListEntriesData'] = ResolversParentTypes['NetworkingListEntriesData']> = {
  data?: Resolver<Maybe<Array<ResolversTypes['NetworkingListEntry']>>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NetworkingListEntryResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['NetworkingListEntry'] = ResolversParentTypes['NetworkingListEntry']> = {
  createdDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = SandboxContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dog?: Resolver<Maybe<ResolversTypes['Dog']>, ParentType, ContextType, RequireFields<QueryDogArgs, 'breed'>>;
  dogs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Dog']>>>, ParentType, ContextType>;
  finance?: Resolver<Maybe<ResolversTypes['Finance']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = SandboxContext> = {
  Dog?: DogResolvers<ContextType>;
  Finance?: FinanceResolvers<ContextType>;
  Folder?: FolderResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NetworkingList?: NetworkingListResolvers<ContextType>;
  NetworkingListEntriesData?: NetworkingListEntriesDataResolvers<ContextType>;
  NetworkingListEntry?: NetworkingListEntryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = SandboxContext> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};
