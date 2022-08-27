module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ae47813dc7beda69d1fdfc9659d0b5b5'),
  },
});
