import React from "react"
import { Tag } from "antd"
import PropTypes from "prop-types"

export default function Genres({ genres, genresList }) {
  genres = genres.filter((item, index) => index < 4)
  const items = genres.map((genreId) => (
    <Tag key={genreId} className='movie-genres__item'>
      {genresList[genreId]}
    </Tag>
  ))
  return <div className='movie-genres'>{items}</div>
}

Genres.propTypes = {
  genres: PropTypes.string,
  genresList: PropTypes.array,
}
