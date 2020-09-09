let db = require("../models");

module.exports = function (app, db) {
    // console.log(db.newUser);
    const { Op } = db.Sequelize;

    // GET route for getting all of the newUsers
    app.get("/api/newUser", function (req, res) {
        db.newUser.findAll().then(result => {
            res.json(result);
        });
    });

    //POST route for saving a new newUser. we can create a new newUser using the data on req.body
    app.post("/api/newUser", function (req, res) {
        db.newUser.create(req.body).then(result => {
            res.json(result);
        });
    });
    // DELETE route for deleting a newUser. We can access the ID of the newUser to delete in req.params.id
    app.delete("/api/newUser/:id", function (req, res) {
        db.newUser.destroy({
            where: {
                id: { [Op.eq]: req.params.id }
            }
        }).then(result => {
            res.json(result);
        });
    });
    // PUT route for updating a newUser. We can access the updated newUser in req.body
    app.put("/api/newUser", function (req, res) {
        db.newUser.update(
            req.body,
            {
                where: {
                    id: { [Op.eq]: req.body.id }
                }
            }).then(result => {
                res.json(result);
            });
    });
};