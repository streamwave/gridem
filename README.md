# jQuery Grid 'Em Plugin

This is a simple jQuery plugin that allows you to evenly apply horizontal spacing on a list of items across multiple rows on a page. Check out the [demo site](http://streamwave.github.com/gridem/ "jQuery gridEm() demo").

## How to use this plugin

Both jQuery and Grid 'Em need to be included as a script on your page. Then simply target your list with gridem(). gridem() will apply the grid spacing to the direct children of the target. For example:

Say you had a list of items in an unordered list (ul). 

    <ul class="products">
      <li><div><img src="product.jpg"/><br/>Product title</li>
      <li><div><img src="product.jpg"/><br/>Product title</li>
      <li><div><img src="product.jpg"/><br/>Product title</li>
      ...
    </ul>

Then you would simply call gridEm() as follows: 

    $(window).load(function() {
      $('.products').each(function() {
        $(this).gridEm();
    });

In the above example, we iterated __$('.product').each()__ which allows gridEm() to grid all lists on the page that have a class of _product_. For best results, it is recommended that you invoke __gridEm()__ once the page has completely loaded as notified by __$(window).load()__. You can invoke __gridEm()__ with __$(document).ready()__ but the DOM might not be completely aware of all the page element dimensions yet.

### Options
 * __minMargin__ &mdash; Minimum margin between items (in pixels) (default: 10)
 * __maxMargin__ &mdash; Maximum margin between items (in pixels) (default: 100)

For example:

    $('.products').gridEm( { minMargin: 10, maxMargin: 50 } );

### Compatibility
* IE7 and above
* Tested with the current versions of popular browsers: Firefox, Chrome, Safari and Opera

### Limitations
This was created to display a grid of items which __all items have the same width__. 

## Contribute
Feel free to make improvements and submit pull requests.

## Support
Please use the issues tracker on GitHub.