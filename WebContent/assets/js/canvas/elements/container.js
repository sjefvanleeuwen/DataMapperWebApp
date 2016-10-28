/**
 * Created by sachithra on 10/24/16.
 */
DataMapper.Views.ContainerView = Backbone.View.extend({
    el: "#canvas",
    menu: "#menu",
    initialize: function () {

    },
    render: function () {
        var el = this.drawInitContainer();
        this.el = "#" + this.id;
        this.model.set('parent', el);
        this.bindMenu(this.menu);
        d3.select(this.el).call(this.dragContainer());
    },
    dragContainer: function () {
        var self = this;
        var selfModel = this.model;
        return d3.drag()
            .on("start", function () {
            })
            .on("drag", function (d, i) {
                this.x = this.x || selfModel.get('x');
                this.y = this.y || selfModel.get('y');
                this.x += d3.event.dx;
                this.y += d3.event.dy;
                d3.select(this).attr("transform", "translate(" + this.x + "," + this.y + ")");
                self.updateConnections(d3.event.dx, d3.event.dy);
                self.resizeCanvas(this.x, this.y);
            })
            .on("end", function () {
                // resizeCanvas();
            });
    },
    bindMenu: function (menu) {
        var self = this;
        var id = this.el;
        var classClicked = id + "-clicked";
        $(id + " .dmcontainer-structure").on("contextmenu", function (event) {
            // console.log(menu);
            // Avoid the real one
            event.preventDefault();

            // Show contextmenu
            $(menu).finish().toggle(100)
                .css({ // In the right position (the mouse)
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                })
                .addClass(classClicked);
        });
        // If the document is clicked somewhere
        $(document).on("mousedown", function (e) {

            // If the clicked element is not the menu
            if (!$(e.target).parents(menu).length > 0) {

                // Hide it
                $(menu).removeClass(classClicked);
                $(menu).hide(100);
            }
        });


// If the menu element is clicked
        $(menu + " li").on("click", function () {
            // This is the triggered action name
            if ($(menu).hasClass(classClicked)) {
                switch ($(this).attr("data-action")) {

                    // A case for each action. Your actions here
                    case "load-schema":
                        $("#" + self.schemaSelect.attr("id")).trigger("click");
                        break;
                    case "clear-container":
                        self.clearContainer();
                        break;
                }
            }

            // Hide it AFTER the action was triggered
            $(menu).hide(100);
        });

    },
    clearContainer: function () {
        //to be overridden by inherited views
    },
    drawInitContainer: function () {
    },
    updateConnections: function (newX, newY) {
        var sourceContainer = d3.select(this.el);
        Diagram.Connectors.findFromSourceContainer(sourceContainer).map(function (connector) {
            connector.set("x2", connector.get("x2") - newX);
            connector.set("y2", connector.get("y2") - newY);
            connector.setPoints();
        });

        d3.select("#canvas").selectAll(".dmcontainer").each(function () {
            if (d3.select(this).attr("id") !== sourceContainer.attr("id")) {
                var opposite = d3.select(this);
                Diagram.Connectors.findFromSourceContainer(opposite).map(function (connector) {
                    if (connector.get('targetContainer').node().isSameNode(sourceContainer.node())) {
                        connector.set("x2", Number(connector.get("x2")) + Number(newX));
                        connector.set("y2", Number(connector.get("y2")) + Number(newY));
                    }
                });
            }
        });
    },
    resizeCanvas: function (x, y) {
        var tempY = Number(d3.select(this.el).select(".dmcontainer-outline").attr("height")) + y,
            tempX = Number(d3.select(this.el).select(".dmcontainer-outline").attr("width")) + x;
        var canvas = d3.select(Diagram.Canvas.el);
        if (canvas.attr("width") < tempX) {
            canvas.attr("width", tempX);
        }
        if (canvas.attr("height") < tempY) {
            canvas.attr("height", tempY);
        }
    }
});

DataMapper.Models.Container = Backbone.Model.extend({});