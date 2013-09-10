# HopCrop

HopCrop is Drupal module that provides a user-friendly way to crop uploaded
images.

## Dependencies

* [JCrop](http://deepliquid.com/content/Jcrop.html)
* [Libraries API](http://drupal.org/project/libraries)

## Installation

You can install HopCrop manually, by downloading HopCrop and Libraries API into
your project and downloading JCrop into a directory that is used by the
Libraries API.

If you use Drush Make, for example through [Kraftwagen](http://kraftwagen.org),
you can simply add the following code to your `.make` file.

    projects[libraries][version] = "2.1"
    projects[libraries][subdir] = "contrib"

    projects[hopcrop][type] = "module"
    projects[hopcrop][download][type] = "git"
    projects[hopcrop][download][url] = "git://github.com/hoppinger/hopcrop.git"
    projects[hopcrop][subdir] = "contrib"

    libraries[Jcrop][download][type] = "file"
    libraries[Jcrop][download][url] = "https://github.com/tapmodo/Jcrop/archive/v0.9.12.tar.gz"
    libraries[Jcrop][download][md5] = "13fe16609c809bd9f8190308b5f088f9"

## Configuration

To enable HopCrop for an image style, you should add the HopCrop action to the
image style. After this, you can use the Field UI to enable the image style for
a certain field.
