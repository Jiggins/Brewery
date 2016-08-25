# Brewery Coffee House Maynooth Point of Sale System

## Requirements

### [Ruby on Rails](http://rubyonrails.org)
Requires Ruby `>= 2` and Rails `>= 5`: [rubyonrails.org](http://rubyonrails.org)

### [ImageMagick](http://www.imagemagick.org/)
[ImageMagick](http://www.imagemagick.org/) must be installed and can be found
on the system `PATH`.

For Mac OS install it using [Homebrew](http://www.brew.sh/):

```console
brew install imagemagick
```

For Debian, use

```console
sudo apt-get install imagemagick -y
```

## Changing image sizes
Default image sizes can be found in `app/models/product.rb`

```ruby
has_attached_file :image, styles: {
  tiny:  '32x32#',
  thumb: '128x128>',
  small: '256x256>'
}
```

Feel free to edit/add another style, then reprocess the images
with `rake paperclip:refresh CLASS=Product`
