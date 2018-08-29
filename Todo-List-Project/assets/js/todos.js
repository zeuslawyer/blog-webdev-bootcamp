// alert('connected'); 

// click listener for completed todo items
$('li').click(function(){
  $(this).toggleClass('todo-completed');
})