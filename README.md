# prisma-doodles

Micro learnings against Prisma 2



### hello-nexus

* How to setup a simple context
* How to setup a simple server
* how to setup models

I made this to understand how the typegen workflow works, and how the so-called backing-types (what I would also call "models") system works.

#### On typegen workflow

I learnt that nexus TypeScript types will be generated according to how I define my schema using the nexus DSL. Those types need to be available to the TypeScript compiler in order to statically type the app.

Three observations:

1. About TypeScript using this generated file: One way for TypeScript to pick it up is be generating the file with extension `.d.ts` into project root. I tried several other ways and configs but [ran into issues](https://github.com/prisma/nexus/issues/130#issuecomment-517956671). For example I could not get TypeScript to pick it up when generated into `node_modules/@types/nexus/nexus.d.ts`. I tried many things for over an hours.

Once the file is found by TypeScript, it augments the global scope with a type that the rest of the nexus codebase looks for. This is elegant.

2. About committing this file: these generated types are not/should not be committed to the codebase in my opinion. They are derived and unlike `schema.graphql` which has potential to bridge communication between teams/expertise, the nexus generated types are not readily readable. [Considering others suggest generating this into node_modules](https://github.com/prisma/nexus/issues/130) it would seem I'm not the only one that thinks this.

3. About bootstrapping: Nexus finds itself in a kind of chicken-and-egg situation, the types come from the codebase, the codebase uses the types, and those types are not available to the codebase until after first build... If I understand correctly, the reason such a bootstrapping works is that nexus falls backs to using `any` type when it cannot find the globally generated types.

#### On the models system

GraphQL is designed to model graphs of data selectable as tree subsets. Resolvers therefore have the concept of receiving a parent value, which is _other_ data that references _this_ data currently being resolved. This pattern recurses upward until the root where parent is naturally `null`.

Now, this `parent` value, contrary to what you might intuitively think, is not the model that will be returned to the client who sent the GraphQL query. Rather, it is the scaler data that the backing data source returned. A backing data source could be the database, microservice, disk, etc. Note we said scaler data. The assumption, to simplify things right now, is that, the graphql data graph, objects of 1) scalers and 2) links to other objects, is resolved by database tables returning rows for each object requestd but IDs in place of said links, because the database is not a graph. There's a whole bunch of things being simplified here but OK its a start.

All of this is a badly told and incomplete story to try and create an understanding for the `sources` feature of nexus. Nexus permits config of sources to tell it what the models of the backing data source are. Then, for each object in the GraphQL data graph, their links, when being resolved, receive a parent value, of type... the said models we configured. Which one? The one whose name matches that of the parent GraphQL object. So for example, for a User Object linked to a list of Post objects, when each Post object is being resolved, they will receive a parent value of type `User`, the registered backing data source model type, _because_ the field being resolved is the child of GraphQL object named `User`.
