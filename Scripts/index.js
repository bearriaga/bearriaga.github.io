$(function () {
    $('.collapse').on('hide.bs.collapse', function () {
        $(this).prev().children('.collapseIcon').html('+');
    })
    $('.collapse').on('show.bs.collapse', function () {
        $(this).prev().children('.collapseIcon').html('-');
    })
});