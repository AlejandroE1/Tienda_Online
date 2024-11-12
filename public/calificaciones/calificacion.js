document.addEventListener('DOMContentLoaded', function() {
    const starRating = document.getElementById('starRating');
    const ratingValue = document.getElementById('ratingValue');
    let currentRating = 0;

    // Function to update stars
    function updateStars(rating) {
        const stars = starRating.getElementsByTagName('svg');
        
        for (let i = 0; i < stars.length; i++) {
            if (i < rating) {
                stars[i].classList.add('filled');
            } else {
                stars[i].classList.remove('filled');
            }
        }
        
        // Update hidden input value
        ratingValue.value = rating;
        currentRating = rating;
    }

    // Add click event listeners to stars
    starRating.addEventListener('click', function(e) {
        const star = e.target.closest('svg');
        if (star) {
            const rating = parseInt(star.getAttribute('data-rating'));
            updateStars(rating);
        }
    });

    // Function to submit the review
    window.submitReview = function() {
        const review = document.querySelector('.review-textarea').value;
        
        // Validate rating
        if (currentRating === 0) {
            alert('Por favor, selecciona una calificación');
            return;
        }

        // Validate review text
        if (!review.trim()) {
            alert('Por favor, escribe una reseña');
            return;
        }

        // Here you can send the data to your backend
        console.log('Rating:', currentRating);
        console.log('Review:', review);

        // You can add your API call here
        // fetch('/api/reviews', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         rating: currentRating,
        //         review: review
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
    };
});