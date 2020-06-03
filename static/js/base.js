$('.close-pop').on('click', function () {
    $(this).parent().parent().hide().find('.cont-div').attr('style', 'visibility: hidden');
})

$('#setBtn').on('click', function () {
    $('.container').attr('style', 'visibility: visible').find('.pop-up').attr('style', 'visibility: visible').siblings().attr('style', 'visibility: hidden');
    BaseSearch();
})