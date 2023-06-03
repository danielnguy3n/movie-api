// https://www.omdbapi.com/?apikey=42f4673d&t=fast

let api
let data

let trendingID = ['tt5971474', 'tt6791350', 'tt10366206', 'tt6718170',
                'tt10954600', 'tt16419074', 'tt9362722', 'tt2906216']

const movieWrapper = document.querySelector(".movie-list")
let isTrending = true

async function rendertrending() {
    // If you map promises, you will get an array of promises instead of the results
    // Use Promise.all to convert into a promise then resolve it to get array of results
    let trendingArr = trendingID.map(async movie => {
        let trendingApi = await fetch(`https://www.omdbapi.com/?apikey=42f4673d&i=${movie}`)
        let trendingData = await trendingApi.json()
        return trendingData
    })

    let movies = await Promise.all(trendingArr)

    movieWrapper.innerHTML = movies.map(movie => movieHTML(movie, isTrending)).join('')

}


async function renderMovies(search = '', filter) {

    document.getElementById('filter').style.display = 'block'

    movieWrapper.innerHTML = '<i class="fa-solid fa-spinner spinner"></i>'

    movieWrapper.classList += ' loading'

    if (!!search) {
        api = await fetch(`https://www.omdbapi.com/?apikey=42f4673d&s=${search}`)
        data = (await api.json()).Search.slice(0,8)
    }

    console.log(data)

    if (filter === 'OLDEST-NEWEST') {
        data.sort((a, b) => a.Year - b.Year)
    } else if (filter === 'NEWEST-OLDEST') {
        data.sort((a, b) => b.Year - a.Year)
    }

    setTimeout (() => {
        movieWrapper.classList.remove('loading')
        movieWrapper.innerHTML = data.map(movie => movieHTML(movie, isTrending = false)).join('')
    }, 250)
}

setTimeout (() => {
    rendertrending()
}, 10)


function movieHTML(movie, isTrending) {
    let year = isTrending ? movie.Released : movie.Year
    return `<div class="movie">
        <figure class="movie__img--wrapper">
        <img class="movie__img" src="${movie.Poster}" alt="">
        </figure>
        <h2 class="movie__title">${movie.Title}</h2>
        <p class="movie__year">${year}</p>
    </div>`
}

function searchFunction(event) {
    document.getElementById('filter').selectedIndex = "0"
    document.querySelector('.search-results').innerHTML = `Search Results: ${event.target.value}` 
    renderMovies(search = event.target.value)
}

function searchButton() {
    const searchBarValue = document.querySelector('.search__bar').value
    renderMovies(search = searchBarValue)
}

function filterMovies(event) {
    renderMovies(search = '', filter = event.target.value)
}

document.querySelector('.search__bar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.activeElement.blur()
    }
})