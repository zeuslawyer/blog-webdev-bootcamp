// alert('connected'); 

// click listener for completed todo items
$('li').click(function(){
	$(this).toggleClass('todo-completed');
})

//alternate row shading
$('li:even').css('background', '#00ffff');
$('li:odd').css('background', '#bfff00');

// fadeout deleted elems. propogate to parent, then remove parent 
// (nb: note the $(this) refers to different objects - first is span, second is span's parent, li !!)
$('span').click(function(event){
	$(this).parent().fadeOut(1500, function(){
		$(this).remove();
	});
	event.stopPropagation();
})

// console.log helper
function log(anything) {
	console.log(anything);
}