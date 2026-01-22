const { ApolloServer, gql} = require('apollo-server');

const typeDefs = gql`
    type Anime {
        id: ID!
        title: String!
    }

    type Query {
      searchAnime(search: String!): [Anime!]!
}
`;

const resolvers = {
    Query: {
        searchAnime: async (_, { search }) => {
            const query = `
            query ($search: String) {
                Media(search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                    }
                }
            }
        `;
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { search }
            })
        });
        const json = await response.json();
        if(!json.data || !json.data.Media) {
            return [];
        }
        const media = json.data.Media;
        return [{
            id: media.id,
            title: media.title.romaji }]
        },
    },
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});