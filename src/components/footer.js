import React from "react"
// import classNames from "classnames/bind"
import { Link } from "gatsby"

import style from "./footer.module.scss"

class Footer extends React.Component {
  render() {
    return (
      <footer className={style.footer}>
        <ul className={style.socials}>
          {/* SVG: Font Awesome  */}
          <li className={style.soc_vk}>
            <a target="_blank" rel="noopener" href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 31 28"
                width="31"
                height="28"
              >
                <title>vk</title>
                <path d="M30 8.1c0.2 0.6-0.5 2.1-2.3 4.6 -3 4-3.4 3.7-0.9 6 2.4 2.2 2.9 3.3 3 3.5 0 0 1 1.8-1.1 1.8l-4 0.1c-0.9 0.2-2-0.6-2-0.6 -1.5-1-2.9-3.7-4-3.4 0 0-1.1 0.4-1.1 2.8 0 0.5-0.2 0.8-0.2 0.8s-0.3 0.3-0.8 0.3h-1.8c-4 0.3-7.4-3.4-7.4-3.4s-3.8-3.9-7.2-11.8c-0.2-0.5 0-0.8 0-0.8s0.2-0.3 0.9-0.3l4.3 0c0.4 0.1 0.7 0.3 0.7 0.3s0.3 0.2 0.4 0.5c0.7 1.8 1.6 3.3 1.6 3.3 1.6 3.2 2.6 3.8 3.2 3.4 0 0 0.8-0.5 0.6-4.4 -0.1-1.4-0.5-2-0.5-2 -0.4-0.5-1-0.6-1.3-0.7 -0.2 0 0.2-0.6 0.7-0.8 0.8-0.4 2.1-0.4 3.7-0.4 1.3 0 1.6 0.1 2.1 0.2 1.5 0.4 1 1.7 1 5 0 1.1-0.2 2.5 0.6 3 0.3 0.2 1.1 0 3.1-3.4 0 0 0.9-1.6 1.7-3.5 0.1-0.3 0.4-0.5 0.4-0.5s0.3-0.1 0.6-0.1l4.5 0c1.4-0.2 1.6 0.5 1.6 0.5Z" />
              </svg>
            </a>
          </li>
          <li className={style.soc_github}>
            <a target="_blank" rel="noopener" href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="28"
                viewBox="0 0 24 28"
              >
                <title>github</title>
                <path d="M12 2c6.6 0 12 5.4 12 12 0 5.3-3.4 9.8-8.2 11.4-0.6 0.1-0.8-0.3-0.8-0.6 0-0.4 0-1.7 0-3.3 0-1.1-0.4-1.8-0.8-2.2 2.7-0.3 5.5-1.3 5.5-5.9 0-1.3-0.5-2.4-1.2-3.2 0.1-0.3 0.5-1.5-0.1-3.2-1-0.3-3.3 1.2-3.3 1.2-1-0.3-2-0.4-3-0.4s-2 0.1-3 0.4c0 0-2.3-1.5-3.3-1.2-0.7 1.7-0.2 2.9-0.1 3.2-0.8 0.8-1.2 1.9-1.2 3.2 0 4.6 2.8 5.6 5.5 5.9-0.3 0.3-0.7 0.8-0.8 1.6-0.7 0.3-2.4 0.8-3.5-1-0.7-1.1-1.8-1.2-1.8-1.2-1.2 0-0.1 0.7-0.1 0.7 0.8 0.4 1.3 1.8 1.3 1.8 0.7 2.1 4 1.4 4 1.4 0 1 0 1.9 0 2.2 0 0.3-0.2 0.7-0.8 0.6-4.8-1.6-8.2-6.1-8.2-11.4 0-6.6 5.4-12 12-12zM4.5 19.2c0-0.1 0-0.1-0.1-0.2-0.1 0-0.2 0-0.2 0 0 0.1 0 0.1 0.1 0.2 0.1 0 0.2 0 0.2 0zM5 19.8c0.1 0 0-0.2 0-0.2-0.1-0.1-0.2-0.1-0.2 0-0.1 0 0 0.2 0 0.3 0.1 0.1 0.2 0.1 0.3 0zM5.5 20.5c0.1-0.1 0.1-0.2 0-0.3-0.1-0.1-0.2-0.2-0.3-0.1-0.1 0-0.1 0.2 0 0.3s0.2 0.2 0.3 0.1zM6.2 21.1c0.1-0.1 0-0.2-0.1-0.3-0.1-0.1-0.2-0.1-0.3 0-0.1 0.1 0 0.2 0.1 0.3 0.1 0.1 0.3 0.1 0.3 0zM7 21.5c0-0.1-0.1-0.2-0.2-0.2-0.1 0-0.3 0-0.3 0.1s0.1 0.2 0.2 0.2c0.1 0 0.3 0 0.3-0.1zM8 21.6c0-0.1-0.1-0.2-0.3-0.2-0.1 0-0.2 0.1-0.2 0.2 0 0.1 0.1 0.2 0.3 0.2 0.1 0 0.3-0.1 0.3-0.2zM8.9 21.4c0-0.1-0.1-0.2-0.3-0.1-0.1 0-0.2 0.1-0.2 0.2 0 0.1 0.1 0.2 0.3 0.1s0.2-0.1 0.2-0.2z" />
              </svg>
            </a>
          </li>
          <li className={style.soc_telegram}>
            <a target="_blank" rel="noopener" href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="28"
                viewBox="0 0 448 512"
              >
                <title>telegram</title>
                <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
              </svg>
            </a>
          </li>
          <li className={style.soc_youtube}>
            <a target="_blank" rel="noopener" href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="28"
                viewBox="0 0 24 28"
              >
                <title>youtube</title>
                <path d="M15.2 19.4v3.3c0 0.7-0.2 1-0.6 1-0.2 0-0.5-0.1-0.7-0.3v-4.7c0.2-0.2 0.5-0.3 0.7-0.3 0.4 0 0.6 0.4 0.6 1zM20.5 19.5v0.7h-1.4v-0.7c0-0.7 0.2-1.1 0.7-1.1s0.7 0.4 0.7 1.1zM5.4 16h1.7v-1.5h-4.9v1.5h1.6v8.9h1.6v-8.9zM9.9 24.9h1.4v-7.7h-1.4v5.9c-0.3 0.4-0.6 0.7-0.9 0.7-0.2 0-0.3-0.1-0.3-0.3 0 0 0-0.2 0-0.5v-5.7h-1.4v6.1c0 0.5 0 0.9 0.1 1.1 0.1 0.4 0.5 0.6 0.9 0.6 0.5 0 1-0.3 1.6-1v0.8zM16.6 22.6v-3.1c0-0.7 0-1.2-0.1-1.5-0.2-0.6-0.6-0.9-1.1-0.9-0.5 0-1 0.3-1.5 0.8v-3.4h-1.4v10.4h1.4v-0.7c0.5 0.6 1 0.9 1.5 0.9 0.5 0 0.9-0.3 1.1-0.9 0.1-0.3 0.1-0.8 0.1-1.6zM21.8 22.5v-0.2h-1.4c0 0.6 0 0.9 0 1-0.1 0.4-0.3 0.6-0.6 0.6-0.5 0-0.7-0.4-0.7-1.1v-1.4h2.8v-1.6c0-0.8-0.1-1.4-0.4-1.8-0.4-0.5-1-0.8-1.7-0.8-0.7 0-1.3 0.3-1.7 0.8-0.3 0.4-0.4 1-0.4 1.8v2.7c0 0.8 0.2 1.4 0.5 1.8 0.4 0.5 1 0.8 1.7 0.8s1.3-0.3 1.7-0.8c0.2-0.2 0.3-0.5 0.3-0.8 0-0.1 0-0.5 0-0.9zM12.3 8.2v-3.3c0-0.7-0.2-1.1-0.7-1.1-0.5 0-0.7 0.4-0.7 1.1v3.3c0 0.7 0.2 1.1 0.7 1.1 0.5 0 0.7-0.4 0.7-1.1zM23.6 19.9c0 1.8 0 3.7-0.4 5.5-0.3 1.2-1.3 2.1-2.5 2.3-2.9 0.3-5.8 0.3-8.7 0.3s-5.8 0-8.7-0.3c-1.2-0.1-2.2-1-2.5-2.3-0.4-1.7-0.4-3.7-0.4-5.5v0c0-1.8 0-3.7 0.4-5.5 0.3-1.2 1.3-2.1 2.5-2.3 2.9-0.3 5.8-0.3 8.7-0.3s5.8 0 8.7 0.3c1.2 0.1 2.2 1 2.5 2.3 0.4 1.8 0.4 3.7 0.4 5.5zM8 0h1.6l-1.9 6.2v4.2h-1.6v-4.2c-0.1-0.8-0.5-1.9-1-3.3-0.3-1-0.7-2-1-2.9h1.7l1.1 4.1zM13.8 5.2v2.7c0 0.8-0.1 1.5-0.4 1.8-0.4 0.5-0.9 0.8-1.7 0.8-0.7 0-1.2-0.3-1.6-0.8-0.3-0.4-0.4-1-0.4-1.8v-2.7c0-0.8 0.1-1.4 0.4-1.8 0.4-0.5 0.9-0.8 1.6-0.8 0.7 0 1.3 0.3 1.7 0.8 0.3 0.4 0.4 1 0.4 1.8zM19 2.7v7.8h-1.4v-0.9c-0.6 0.7-1.1 1-1.6 1-0.5 0-0.8-0.2-0.9-0.6-0.1-0.2-0.1-0.6-0.1-1.2v-6.2h1.4v5.7c0 0.3 0 0.5 0 0.5 0 0.2 0.1 0.3 0.3 0.3 0.3 0 0.6-0.2 0.9-0.7v-6h1.4z" />
              </svg>
            </a>
          </li>
          <li className={style.soc_feed}>
            <a target="_blank" rel="noopener" href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="28"
                viewBox="0 0 22 28"
              >
                <title>feed</title>
                <path d="M6 21c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3zM14 22.9c0 0.3-0.1 0.5-0.3 0.8-0.2 0.2-0.5 0.3-0.7 0.3h-2.1c-0.5 0-0.9-0.4-1-0.9-0.5-4.8-4.2-8.5-9-9-0.5 0-0.9-0.5-0.9-1v-2.1c0-0.3 0.1-0.5 0.3-0.7 0.2-0.2 0.4-0.3 0.7-0.3h0.1c3.3 0.3 6.5 1.7 8.8 4.1 2.4 2.4 3.8 5.5 4.1 8.8zM22 23c0 0.3-0.1 0.5-0.3 0.7-0.2 0.2-0.4 0.3-0.7 0.3h-2.2c-0.5 0-1-0.4-1-0.9-0.5-9.1-7.7-16.3-16.8-16.8-0.5 0-0.9-0.5-0.9-1v-2.2c0-0.3 0.1-0.5 0.3-0.7 0.2-0.2 0.4-0.3 0.7-0.3h0c5.5 0.3 10.6 2.6 14.5 6.5 3.9 3.9 6.2 9 6.5 14.5z" />
              </svg>
            </a>
          </li>
        </ul>

        <ul className={style.link}>
          <li>
            <a href="/projects">Проекты</a>
          </li>
          <li>
            <a href="mailto:sfd">mailg@gmail.com</a>
          </li>
          <li>
            <a href="/about">Обо Мне</a>
          </li>
        </ul>

        <p className={style.text}>
          Copyright © <a href="dfsdf">Grishy </a> {new Date().getFullYear()}. <br></br> with
          <span className={style.heart_wrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1rem"
              height="1rem"
              viewBox="0 0 24 24"
              className={style.heart}
            >
              <path d="M12 21.328l-1.453-1.313c-5.156-4.688-8.531-7.734-8.531-11.531 0-3.094 2.391-5.484 5.484-5.484 1.734 0 3.422 0.844 4.5 2.109 1.078-1.266 2.766-2.109 4.5-2.109 3.094 0 5.484 2.391 5.484 5.484 0 3.797-3.375 6.891-8.531 11.578z" />
            </svg>
          </span>
        </p>
      </footer>
    )
  }
}

export default Footer
