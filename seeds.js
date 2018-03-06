var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var campgroundArray = [
    {
        name: "Cotton Candy Overlook",
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=1050&q=80",
        description: "Check out a sweet view of the cotton candy clouds!  Please keep children away from the cotton candy. Mixtape chicharrones woke hot chicken hammock pop-up yr viral keffiyeh waistcoat street art. Mumblecore ethical shabby chic iPhone 8-bit. Street art vice vegan polaroid, put a bird on it gochujang retro kale chips echo park cray meditation cronut jianbing. Cold-pressed paleo cronut pop-up, man braid single-origin coffee beard twee fashion axe kogi messenger bag freegan jianbing marfa. Jean shorts taxidermy banh mi flannel fanny pack tilde tattooed meh photo booth beard. Shabby chic dreamcatcher tumblr, neutra paleo four dollar toast fixie kogi chartreuse vaporware kinfolk tote bag letterpress. Waistcoat wolf raw denim lyft, crucifix ethical kombucha tousled tbh iPhone."
    },
    {
        name: "Pretzel Stick Lodge",
        image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=552042ed8cfeb4a1e8e62ae2a75f661e&auto=format&fit=crop&w=1050&q=80",
        description: "Enjoy a night (or two) in this cozy lodge surrounded by tasty pretzel stick trees!  Note: damaging, vandalizing, or eating pretzel trees is prohibited. Mixtape chicharrones woke hot chicken hammock pop-up yr viral keffiyeh waistcoat street art. Mumblecore ethical shabby chic iPhone 8-bit. Street art vice vegan polaroid, put a bird on it gochujang retro kale chips echo park cray meditation cronut jianbing. Cold-pressed paleo cronut pop-up, man braid single-origin coffee beard twee fashion axe kogi messenger bag freegan jianbing marfa. Jean shorts taxidermy banh mi flannel fanny pack tilde tattooed meh photo booth beard. Shabby chic dreamcatcher tumblr, neutra paleo four dollar toast fixie kogi chartreuse vaporware kinfolk tote bag letterpress. Waistcoat wolf raw denim lyft, crucifix ethical kombucha tousled tbh iPhone."
    },
    {
        name: "Graham Cracker Lake",
        image: "https://images.unsplash.com/photo-1458571037713-913d8b481dc6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9d37131fba1ae2765785a7c91681b616&auto=format&fit=crop&w=1055&q=80",
        description: "Graham crackers floating on a pristine lake!  Canoes are welcome while weather permits.  Melting chocolates and/or marshmallows on graham crackers will result in fines and/or permanent barring from premises. Mixtape chicharrones woke hot chicken hammock pop-up yr viral keffiyeh waistcoat street art. Mumblecore ethical shabby chic iPhone 8-bit. Street art vice vegan polaroid, put a bird on it gochujang retro kale chips echo park cray meditation cronut jianbing. Cold-pressed paleo cronut pop-up, man braid single-origin coffee beard twee fashion axe kogi messenger bag freegan jianbing marfa. Jean shorts taxidermy banh mi flannel fanny pack tilde tattooed meh photo booth beard. Shabby chic dreamcatcher tumblr, neutra paleo four dollar toast fixie kogi chartreuse vaporware kinfolk tote bag letterpress. Waistcoat wolf raw denim lyft, crucifix ethical kombucha tousled tbh iPhone."
    }
];

function seedDB(){    
    Campground.remove({}, function(err){ //remove all
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds...");
            campgroundArray.forEach(function(item){ //iterate & add campgrounds
                Campground.create(item, function(err, campgroundCreated){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added campground: " + campgroundCreated.name);
                        Comment.create({
                            text: "Wonderful experience with the family!  But where are the vending machines?",
                            author: "Jane"
                        }, function(err, commentCreated){
                            if(err){
                                console.log(err);
                            } else {
                                campgroundCreated.comments.push(commentCreated._id);
                                campgroundCreated.save();
                                console.log("Created comment");
                            }
                        });
                    }
                });
            });
        }
    });
    
}

module.exports = seedDB;

