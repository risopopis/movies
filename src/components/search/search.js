import React, { Component } from "react"
import { Input, Spin, Alert, Pagination } from "antd"
import { debounce } from "lodash"
import "./search.css"
import PropTypes from "prop-types"

import MovieList from "../movies-list/movies-list.js"
import Api from "../api.js"

export default class Seacrh extends Component {
  api = new Api()

  state = {
    movieDate: [],
    loading: false,
    error: null,
    inputValue: "",
    totalMovies: 0,
    currentPage: 1,
  }

  componentDidMount() {
    const { savedInputSearch, savedCurrentPage } = this.props
    this.setState({ currentPage: savedCurrentPage.seacrhPage })
    if (savedInputSearch) {
      this.setState({ inputValue: savedInputSearch })
      this.getMovieList(
        savedInputSearch.toString(),
        savedCurrentPage.seacrhPage
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputValue, currentPage } = this.state
    if (
      inputValue !== prevState.inputValue ||
      currentPage !== prevState.currentPage
    ) {
      this.getMovieList(inputValue.toString(), currentPage)
      return
    }
    this.getMovieList.cancel()
  }

  onChange = (e) => {
    const { onChangeInputValue, onChangeCurrentPage } = this.props
    this.setState({ inputValue: e.target.value, currentPage: 1 })
    onChangeInputValue(e.target.value)
    onChangeCurrentPage(1, true)
  }

  getMovieList = debounce((str, currentPage) => {
    if (!str) return
    this.goLoad()
    this.api
      .getMovies(str, currentPage)
      .then((result) => {
        if (result.results.length !== 0) {
          this.setState({
            movieDate: result.results,
            totalMovies: result.total_results,
            loading: false,
            error: null,
          })
        } else throw new Error("oops i guess i found nothing")
      })
      .catch((e) => this.setState({ error: e, loading: false, currentPage: 1 }))
  }, 800)

  onPaginationChange = (currentPage) => {
    this.setState({ currentPage })
    const { onChangeCurrentPage } = this.props
    onChangeCurrentPage(currentPage, true)
  }

  goLoad() {
    this.setState({ loading: true })
  }

  render() {
    const { movieDate, loading, error, totalMovies, currentPage, inputValue } =
      this.state
    const body = (
      <>
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
      </>
    )

    return (
      <main className='movies'>
        <Input
          className='movies__input'
          ref={this.input}
          value={inputValue}
          onChange={this.onChange}
          placeholder='what are we watching today?'
        />
        {loading ? <Spin className='movies__spin' size='large' /> : null}
        {error ? (
          <Alert message={error.message} type='error' showIcon />
        ) : (
          { ...body }
        )}
      </main>
    )
  }
}

Seacrh.propTypes = {
  savedInputSearch: PropTypes.string,
  savedCurrentPage: PropTypes.number,
  onChangeInputValue: PropTypes.func,
  onChangeCurrentPage: PropTypes.func,
}
