import React from "react";

export default class Slideshow extends React.Component {
  state = {
    images: [
      {
        image: "https://cdn.myanimelist.net/images/anime/1134/111757.jpg",
        link: "https://myanimelist.net/anime/41025/Fumetsu_no_Anata_e",
      },
      {
        image: "https://cdn.myanimelist.net/images/anime/1200/111522.jpg",
        link:
          "https://myanimelist.net/anime/43325/Yuukoku_no_Moriarty_2nd_Season",
      },
      {
        image: "https://cdn.myanimelist.net/images/anime/1900/110097.webp",
        link: "https://myanimelist.net/anime/42361/Ijiranaide_Nagatoro-san",
      },
      {
        image: "https://cdn.myanimelist.net/images/anime/1493/113949.webp",
        link: "https://myanimelist.net/anime/42249/Tokyo_Revengers",
      },
      {
        image: "https://cdn.myanimelist.net/images/anime/1104/113797.webp",
        link: "https://myanimelist.net/anime/41457/86",
      },
      {
        image: "https://cdn.myanimelist.net/images/anime/1212/113448.webp",
        link: "https://myanimelist.net/anime/41265/Mars_Red",
      },
    ],
  };
  render() {
    return (
      <div className="imageGrid">
        {this.state.images.map((item, index) => (
          <a href={item.link} target="_blank">
            <img key={index} src={item.image} alt="" />
          </a>
        ))}
      </div>
    );
  }
}
