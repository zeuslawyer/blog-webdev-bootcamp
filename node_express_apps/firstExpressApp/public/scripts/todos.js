// alert('connected'); 

// click listener for completed todo items
$('ul#ul-main').on('click', 'li', function(){
	$(this).toggleClass('todo-completed');
})

// click listener - fadeout deleted elems. propogate to parent, then remove parent 
// (nb: note the $(this) refers to different objects - first is span, second is span's parent, li !!)
$('ul#ul-main').on('click', 'span', function(event){
	console.log($(this));
	$(this).parent().fadeOut(800, function(){
		console.log($(this));
		$(this).remove();
	});
	event.stopPropagation();
});

//input listener - when enter pressed collect value and add to TODO list
$("input[type='text']").keypress(function(event){
	var inputText = $(this).val();  //collect text input and check if not ''
	if(event.which === 13 && inputText) {
		$('ul#ul-main').append('<li><span><i class="far fa-trash-alt"></i></span> ' + inputText + '</li>');  //append it to the ul and create new li elem
		$(this).val(''); //reset input field to blank text
	}
})


// console.log helper function
function log(...args) {
	console.log(...args);
}
