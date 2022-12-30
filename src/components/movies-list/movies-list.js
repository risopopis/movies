import React from "react"

import MoviesDetail from "../movies-details/movies-details.js"
import "./movies-list.css"
import PropTypes from "prop-types"

export default function MovieList({ movies, genresList }) {
  let items
  if (movies) {
    items = movies.map((movie) => {
      const { id, title, overview } = movie
      const path = movie.poster_path
      const release = movie.release_date
      const voteAverage = movie.vote_average
      const genres = movie.genre_ids

      return (
        <li key={id} className='movie-list__movie'>
          <MoviesDetail
            title={title}
            description={overview}
            release={release}
            id={id}
            path={path}
            voteAverage={voteAverage}
            genresList={genresList}
            genres={genres}
          />
        </li>
      )
    })
  } else {
    items = undefined
  }
  return <ul className='movie-list'>{items}</ul>
}

MovieList.propTypes = {
  movies: PropTypes.array,
  genresList: PropTypes.array,
}
