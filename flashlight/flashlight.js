module.exports = function (app) {

  app.get('/api/flashlight', function (req, res, next) {
    console.log('Cool song');
    res.status(200).json({message: 'I\'m listen to you'});
  })
};