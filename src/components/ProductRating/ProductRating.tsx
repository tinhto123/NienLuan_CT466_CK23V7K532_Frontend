export default function ProductRating({
  rating,
  activeClassname,
  nonActiveClassname
}: {
  rating: number
  activeClassname?: string
  nonActiveClassname?: string
}) {
  function handleWidth(order: number) {
    if (order <= rating) {
      return '100%'
    } else if (order > rating && order - rating < 1) {
      return (rating - Math.floor(rating)) * 100 + '%'
    }
    return '0%'
  }
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div className='relative' key={i}>
            <div
              className='absolute left-0 top-0 h-full w-[100%] overflow-hidden'
              style={{ width: handleWidth(i + 1) }}
            >
              <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x={0} y={0} className={activeClassname}>
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
            <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x={0} y={0} className={nonActiveClassname}>
              <polygon
                points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </svg>
          </div>
        ))}
    </>
  )
}
