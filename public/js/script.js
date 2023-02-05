window.onload = (event) => {
        // Preloading images
        let images = document.querySelectorAll("img");
        let imagesCount = images.length;
        let imagesLoaded = 0;
        images.forEach(img => {
          img.addEventListener("load", () => {
            imagesLoaded++;
            if (imagesLoaded === imagesCount) {
              // All images have finished loading, apply stylesheet
              console.log('page fully loaded');
            }
          });
        }); 
    
}



// $.ajax({
//     url: `/student/` + id,
//     type: 'POST',
//     data: formData,
//     processData: false,
//     contentType: false,
//     success: function(data) {
//       alert("student added");
//     },
//     error: function(xhr, status, error) {
//       if (xhr.status === 400) {
//         alert(xhr.responseJSON.message);
//         window.location('/projects/new?studentId=' + xhr.responseJSON.id);
//         // return false;
//       }
//     }
//   });
  