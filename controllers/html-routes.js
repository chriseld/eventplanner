// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
var db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
module.exports = function(app) {
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    //res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });
  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    db.Events.findAll().then(dbEvents => {
      // eslint-disable-next-line no-unused-vars
      dbEvents.forEach(event => {
        console.log(event.dataValues);
      });
      //res.sendFile(path.join(__dirname, "../public/members.html"));
      res.render("members", { events: dbEvents });
    });
  });
  //route to buildevent page to add an event
  app.get("/buildEvent", isAuthenticated, function(req, res) {
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });
  //or main page
  app.get("/events", function(req, res) {
    db.Events.findAll().then(dbEvents => {
      // eslint-disable-next-line no-unused-vars
      dbEvents.forEach(event => {
        console.log(event.dataValues);
      });
      res.render("events", { events: dbEvents });
    });
  });
  // to display events per category on events template
  app.get("/events/category/:category", function(req, res) {
    db.Events.findAll({
      where: {
        category: req.params.category
      }
    }).then(dbEvents => {
      //res.render(`events/category/${category}`, { events: dbEvents });
      //res.render("sports", { events: dbEvents });
      res.render("members", { events: dbEvents });
    });
  });

  app.get("/sports", function(req, res) {
    db.Events.findAll({
      where: {
        category: "Sports"
      }
    }).then(dbEvents => {
      res.render("sports", { events: dbEvents });
    });
  });
  app.get("/arts", function(req, res) {
    db.Events.findAll({
      where: {
        category: "Arts"
      }
    }).then(dbEvents => {
      res.render("arts", { events: dbEvents });
    });
  });
  app.get("/education", function(req, res) {
    db.Events.findAll({
      where: {
        category: "Education"
      }
    }).then(dbEvents => {
      res.render("Education", { events: dbEvents });
    });
  });
  app.get("/music", function(req, res) {
    db.Events.findAll({
      where: {
        category: "Music"
      }
    }).then(dbEvents => {
      res.render("music", { events: dbEvents });
    });
  });
  app.get("/favorites", function(req, res) {
    db.Events.findAll({
      where: {
        favorite: true
      }
    }).then(dbEvents => {
      res.render("favorites", { events: dbEvents });
    });
  });

  // to delete an event??
  // app.delete("/events/:id", function(req, res) {
  //   //req.body.id vs req.params.id??
  //   db.Events.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then(
  //     //??
  //     //res.render??
  //     //redirect here
  //     res.redirect("/members")
  //   );
  // });
};
