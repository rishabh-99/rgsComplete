<!DOCTYPE html>
<html>
 <head>
  <title>Build your files structure</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>    
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
  <script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-treeview/1.2.0/bootstrap-treeview.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-treeview/1.2.0/bootstrap-treeview.min.css" />
  <style>
  </style>
 </head>
 <body>
  <br /><br />
  <div class="container" style="width:900px;">
   <h2 align="center">Your Repositories</h2>
   <br /><br />
   <div class="row">
    <div class="col-md-12 offset-3">
     <h3 align="center"><u>Repositories</u></h3>
     <br />
     <form method="post" id="treeview_form">
	 <div class="form-group">
       <label>Enter New Repo Name</label>
       <input type="text" name="Rname" id="Rname" class="form-control">
      </div>
	   <div class="form-group">
       <input type="submit" name="action" id="action" value="Add" class="btn btn-info" />
      </div>







      <div class="form-group">
       <label>Select Repositories</label>
       <select name="repoName" id="repoName" class="form-control">
       
       </select>
      </div>


	
	  




      <div class="form-group">
       <input type="submit" name="action" id="action" value="Next" class="btn btn-info" />
      </div>
     </form>
    </div>
   
  </div>
  <script>

  


 $(document).ready(function(){
  fill_parent_category();

 
  


  

 
  


	function fill_parent_category()
  {
   $.ajax({
    url:'get-repos.php',
    success:function(data){
     $('#repoName').html(data);
	 
    }
   });
   
  }

  $('#repoName').on('submit', function(event){
   event.preventDefault();
   $.ajax({
    url:"addRepos.php",
    method:"POST",
    data:$(this).serialize(),
    success:function(data){
     
     fill_parent_category();
     
    }
   })
  });
 });

</script>
 </body>
</html>



