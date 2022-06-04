var save = document.getElementsByClassName("save");
const deleteSaved = document.querySelectorAll(".deleteSaved")
const savedMusic = document.querySelector(".savedMusic").querySelectorAll(".artistName")

Array.from(save).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log('trying to save')
        const movieTitle = this.parentNode.querySelector('.albumName').innerText
        const director = this.parentNode.querySelector('.artist').innerText
        const moviePoster = this.parentNode.querySelector('.link').innerText
        console.log(moviePoster)
        fetch('saveMovie', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'movieTitle': movieTitle,
            'director': director,
            'moviePoster': moviePoster
          })
        })
        .then(response => {
          console.log(response)
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

deleteSaved.forEach((button) => {
  button.addEventListener('click', function(){
    let movieId = button.parentNode.childNodes[1].innerText
    console.log(movieId)
    console.log(button.parentNode.childNodes)

    fetch('deleteSave', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        movieId: movieId,
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
})
