import { Component } from "react"

export default class Api extends Component {
  _apiBase = "https://api.themoviedb.org/3/"
  _apiKey = "api_key=ac9bd2101529c26d681bfd9cc2a5f3b7"
  _apiBasePoster = "https://image.tmdb.org/t/p/w500"
  session = localStorage.getItem("session") || ""

  async createGuestSession() {
    this.session = localStorage.getItem("session")
    if (!this.session) {
      const request = await fetch(
        `${this._apiBase}authentication/guest_session/new?${this._apiKey}`
      )
      const response = await request.json()
      if (!response.success) throw new Error("Failed")
      this.session = response.guest_session_id
      localStorage.setItem("session", JSON.stringify(this.session))
    }
  }

  async rateMovie(id, rating) {
    const obj = { value: rating }
    const request = await fetch(
      `${this._apiBase}movie/${id}/rating?${
        this._apiKey
      }&guest_session_id=${JSON.parse(this.session)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(obj),
      }
    )

    const response = await request.json()
    if (!response.success) throw new Error("Failed")
    return response
  }

  async getRatedMovies(page) {
    if (!this.session) throw new Error("Not created")
    const request = await fetch(
      `${this._apiBase}guest_session/${JSON.parse(
        this.session
      )}/rated/movies?page=${page}&${this._apiKey}`,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    )
    const response = await request.json()
    return response
  }

  async getMovies(query, page) {
    if (query.length === 0) return { results: null }
    const request = await fetch(
      `${this._apiBase}search/movie?${this._apiKey}&query=${query}&page=${page}`
    )
    const response = await request.json()
    return response
  }

  async getPoster(str) {
    const response = await fetch(`${this._apiBasePoster}${str}`)
    const file = await response.blob()
    const url = URL.createObjectURL(file)
    return url
  }

  async getGenres() {
    const response = await fetch(
      `${this._apiBase}genre/movie/list?${this._apiKey}`
    )
    const body = await response.json()
    const genres = {}
    body.genres.forEach((genre) => {
      genres[genre.id] = genre.name
    })
    return genres
  }
}
