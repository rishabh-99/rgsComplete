var axios=require('axios');


 $(document).ready(function(){
  fill_parent_category();
  
	function fill_parent_category()
  {

   $.ajax({
    url:'get-repos.php',
    success:function(data){
     $('#pid').html(data);
      console.log(data);
    }
   });

  }

  $('#treeview_form').on('submit', function(event){
   event.preventDefault();
   $.ajax({
    url:"addRe.php",
    method:"POST",
    data:$(this).serialize(),
    success:function(data){
     fill_parent_category();
     alert(data);
    }
   })
  }); 


  $('#Submit_form').on('submit', function(event){
   event.preventDefault();
     var b=this['pid']['value'];
     $.ajax({
        url:"http://localhost:8080/reposId",
        method:"POST",
        data:$(b).serialize(),
        success:function(data){
         fill_parent_category();
         alert(data);
        }
       })
    
   

   window.location.href = "index.php";

  });
 });






