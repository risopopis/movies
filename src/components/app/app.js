import React, { Component } from "react"
import { Alert, Menu } from "antd"
import "./app.css"

import { GenresProvider } from "../genres-context/genres-context"
import Seacrh from "../search/search"
import Api from "../api"
import Rated from "../rated/rated"

export default class App extends Component {
  state = {
    error: null,
    genresList: null,
    selectedPage: "search",
    inputSearch: "",
    savedCurrentPage: {
      seacrhPage: 1,
      ratedPage: 1,
    },
  }

  api = new Api()

  componentDidMount() {
    window.addEventListener("offline", () => {
      this.setState({ error: new Error("No connection") })
    })

    window.addEventListener("online", () => {
      this.setState({ error: null })
    })

    this.getGenres()
    this.api.createGuestSession()
  }

  onChangeInputValue = (value) => this.setState({ inputSearch: value })

  onChangeCurrentPage = (page, seacrhFlag) => {
    this.setState(({ savedCurrentPage }) => {
      const newObj = { ...savedCurrentPage }
      if (seacrhFlag) {
        newObj.seacrhPage = page
      } else newObj.ratedPage = page
      return { savedCurrentPage: newObj }
    })
  }

  getGenres = () => {
    this.api
      .getGenres()
      .then((genresList) => this.setState({ genresList }))
      .catch((error) => this.setState({ error }))
  }

  onSelect = ({ key }) => {
    this.setState({ selectedPage: key })
  }

  render() {
    const { error, genresList, selectedPage, inputSearch, savedCurrentPage } =
      this.state
    const menu = [
      { label: "search", key: "search" },
      { label: "rated", key: "rated" },
    ]
    return (
      <GenresProvider value={genresList}>
        {error ? <Alert type='error' message={error.message} showIcon /> : null}
        <section className='movie-menu'>
          <Menu
            className='movie-menu__page'
            items={menu}
            mode='horizontal'
            selectedKeys={selectedPage}
            onSelect={this.onSelect}
          />
          {selectedPage === "search" ? (
            <Seacrh
              onChangeInputValue={this.onChangeInputValue}
              savedInputSearch={inputSearch}
              savedCurrentPage={savedCurrentPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          ) : (
            <Rated
              savedCurrentPage={savedCurrentPage}
              onChangeCurrentPage={this.onChangeCurrentPage}
            />
          )}
        </section>
      </GenresProvider>
    )
  }
}
