const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');

// all campgrounds show page
module.exports.index = async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', { allCampgrounds });
};

// form for new form
module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
};

// create new campground
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

// Individual Campground Show page
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author');

    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show', { campground });
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render(`campgrounds/edit`, { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(
        id,
        req.body.campground
    );

    // if images are added to the campground:
    const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    campground.images.push(...imgs);

    // deleting selected images in the req.body.deleteImages array from cloudinary
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }

    campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash(
        'success',
        `Successfully deleted ${campground.title} campground!`
    );
    res.redirect('/campgrounds');
};
