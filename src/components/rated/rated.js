import React, { Component } from "react"
import { Spin, Alert, Pagination } from "antd"
import { debounce } from "lodash"
import PropTypes from "prop-types"
import MovieList from "../movies-list/movies-list.js"
import Api from "../api.js"

import "./rated.css"

export default class Rated extends Component {
  api = new Api()

  state = {
    movieDate: [],
    load: false,
    error: null,
    totalMovies: 0,
    currentPage: 1,
  }

  componentDidMount() {
    const { savedCurrentPage } = this.props
    this.setState({ currentPage: savedCurrentPage.ratedPage })
    const { currentPage } = this.state
    this.getMovieList(currentPage)
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state
    if (currentPage !== prevState.currentPage) {
      this.getMovieList(currentPage)
    }
  }

  getMovieList = debounce((currentPage) => {
    this.goLoad()
    this.api
      .getRatedMovies(currentPage)
      .then((result) =>
        this.setState({
          movieDate: result.results,
          totalMovies: result.total_results,
          load: false,
          error: null,
        })
      )
      .catch((e) => this.setState({ error: e, load: false }))
  }, 100)

  onPaginationChange = (currentPage) => {
    this.setState({ currentPage })
    const { onChangeCurrentPage } = this.props
    onChangeCurrentPage(currentPage, false)
  }

  goLoad() {
    this.setState({ load: true })
  }

  render() {
    const { movieDate, load, error, totalMovies, currentPage } = this.state
    return (
      <main className='movies'>
        {load ? <Spin className='movies__spin' size='large' /> : null}
        {error ? <Alert message={error.message} type='error' showIcon /> : null}
        <MovieList movies={movieDate} />
        <Pagination
          className='movies__pagination'
          total={totalMovies}
          current={currentPage}
          pageSize={20}
          size='small'
          hideOnSinglePage
          showSizeChanger={false}
          onChange={this.onPaginationChange}
        />
      </main>
    )
  }
}

Rated.propTypes = {
  savedCurrentPage: PropTypes.string,
  onChangeCurrentPage: PropTypes.func,
}
