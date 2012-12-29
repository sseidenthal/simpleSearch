/* Simplion SimpleSearch
 * This is an Html Text Form Element with an Ajax Search
 * @author: Steve Seidenthal
 * */

(function($){

    $.fn.extend({

        simpleSearch : function(options) {

            var defaults = {
                json: '/test.php',
                cache: false
            };

            var options = $.extend(defaults, options);

            var methods = {

                init : function(obj, options) {

                    var container = $('<div></div>').attr({'class':'input-append'});
                    container.append($('#'+obj.attr('id')).clone().attr({'id':obj.attr('id')+'_display','name':''}).val(options.visibleValue));
                    container.append($('<button></button>').attr({'type':'button','class':'btn','id':'clean_'+obj.attr('id')}).append($('<i></i>').attr({'class':'icon-remove'})));
                    container.append($('<button></button>').attr({'type':'button','class':'btn','id':'search_'+obj.attr('id')}).text('Search'));
                    container.insertBefore($('#'+obj.attr('id')));

                    $('#clean_'+obj.attr('id')).on('click', function(e) {
                        $('#'+obj.attr('id')+'_display').val('');
                        $('#'+obj.attr('id')+'_display').focus();
                    });

                    $('#search_'+obj.attr('id')).on('click', function(e) {
                        if($('#'+obj.attr('id')+'_display').val().length > options.minLength) {
                            methods.query(obj, options, $('#'+obj.attr('id')+'_display').val());
                        }
                    });

                    $('#'+obj.attr('id')).hide();
                },

                query : function(obj, options, query)
                {
                    $.ajax({
                        url: options.url,
                        type: 'post',
                        cache: options.cache,
                        dataType: 'json',
                        data: {'query':query},
                        success: function(data) {
                            methods.render(obj, options, data);
                        },
                        error: function() {
                            //alert('There was a problem fetching Data from ' + options.url);
                        }

                    });
                },

                render : function(obj, options, data)
                {
                    $('#'+'easysearch_'+obj.attr('id')).remove();

                    var ul = $('<ul></ul>').attr({'class':'results','id':obj.attr('id')+'_results'});

                    $(data).each(function(i,o) {
                        var li = $('<li></li>').html(o.label).on('click', function(e,i) {
                            $('#'+obj.attr('id')).val(o.id);
                            $('#'+obj.attr('id')+'_display').val(o.label);
                            $('#'+'easysearch_'+obj.attr('id')).hide();
                        });
                        ul.append(li);
                    });

                    $('<div></div>').attr({'id':'easysearch_'+obj.attr('id'),'class':'easysearch'}).append(ul).insertAfter($('#'+obj.attr('id')));
                }

            }

            return this.each(function() {
                var o = options;
                var obj = $(this);
                methods.init(obj, o);
            });
        }
    });
})(jQuery);