import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { useInView } from "react-intersection-observer"

const GifVideo = ({ threshold = 0.15, ...playerProps }) => {
  const [ref, inView] = useInView({ threshold })

  useEffect(() => {
    if (inView) {
      ref.current?.play()
    } else {
      ref.current?.pause()
    }
  }, [ref, inView])

  return <video ref={ref} autoPlay playsInline muted loop {...playerProps} />
}

export default GifVideo

GifVideo.propTypes = {
  src: PropTypes.string,
  threshold: PropTypes.number,
  className: PropTypes.string,
}