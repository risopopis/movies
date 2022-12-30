import React, { Component } from "react"
import { Card, Typography, Spin, Avatar, Rate, Image } from "antd"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import PropTypes from "prop-types"
import Api from "../api"
import Genres from "../genres/genres"
import { GenresConsumer } from "../genres-context/genres-context"

import "./movies-details.css"

import noImage from "./noImage.jpg"

const { Title, Text, Paragraph } = Typography

const getColorVote = (vote) => {
  if (vote <= 3) return "#E90000"
  if (vote <= 5) return "#E97E00"
  if (vote <= 7) return "#E9D100"
  return "#66E900"
}

export default class MoviesDetail extends Component {
  api = new Api()

  state = {
    url: null,
    loading: false,
    stars: 0,
  }

  moviePlot = React.createRef()

  movieTitle = React.createRef()

  componentDidMount() {
    this.getPoster()

    const { id } = this.props
    const ratedMoviesStorage = localStorage.getItem("ratedMovies")
    if (ratedMoviesStorage) {
      const ratedMovies = JSON.parse(ratedMoviesStorage)
      if (ratedMovies[id]) {
        this.setState({ stars: ratedMovies[id] })
      }
    }
  }

  getPoster() {
    this.setState({ loading: true })
    const { path } = this.props
    if (path !== null) {
      this.api
        .getPoster(path)
        .then((res) => this.setState({ url: res, loading: false }))
        .catch(() => this.setState({ url: noImage, loading: false }))
    } else {
      this.setState({ url: noImage, loading: false })
    }
  }

  onChange = (rating) => {
    const { id } = this.props
    this.setState({ stars: rating })
    this.api.rateMovie(id, rating).then(() => {
      if (!localStorage.getItem("ratedMovies"))
        localStorage.setItem("ratedMovies", JSON.stringify({}))
      const ratedMovies = JSON.parse(localStorage.getItem("ratedMovies"))
      ratedMovies[id] = rating
      localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies))
    })
  }

  render() {
    const { title, id, description, release, voteAverage, genres } = this.props
    const { loading, url, stars } = this.state
    return (
      <Card
        key={id}
        className='movie'
        cover={
          loading ? (
            <Spin className='movie__spin' />
          ) : (
            <Image
              className='movie__poster'
              height={400}
              width={300}
              src={url}
              alt='movie-poster'
            />
          )
        }
      >
        <Avatar
          className='movie__vote-average'
          size={30}
          style={{
            borderColor: getColorVote(voteAverage),
          }}
        >
          {voteAverage}
        </Avatar>
        <Title className='movie__title' ref={this.movieTitle}>
          {title}
        </Title>
        <Text className='movie__date-release'>
          {release ? format(parseISO(release), "MMMM d, y") : "Month day, Year"}
        </Text>
        <GenresConsumer>
          {(genresList) => <Genres genres={genres} genresList={genresList} />}
        </GenresConsumer>
        <Paragraph className='movie__description' ref={this.moviePlot}>
          {description || "No description"}
        </Paragraph>
        <Rate
          className='movie__rate'
          allowHalf
          value={stars}
          onChange={this.onChange}
          count={10}
          allowClear={false}
        />
      </Card>
    )
  }
}

MoviesDetail.propTypes = {
  id: PropTypes.number,
  path: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  release: PropTypes.string,
  voteAverage: PropTypes.number,
  genres: PropTypes.string,
}
