import React from 'react'
import commentorIcon from "../../../assets/avatar.png"
import {formatDate} from "../../../utils/formatDate"
const ReviewsCard = ({productReviews}) => {
    const reviews = productReviews || []
    console.log(reviews)
  return (
    <div className='my-6 bg-white p-8'>
        <div>
            {
                reviews.length > 0 ? (<div>
                    <h3 className ="text-lg font-medium">All comments...</h3>
                    <div>
                        {
                            reviews.map((review, index)=>(
                                <div key={index} className="mt-4">
                                    <div>
                                        <img src={commentorIcon} alt="" />
                                        <div>
                                            <p>{review?.userId?.username}</p>
                                            <p>{formatDate(review?.updatedAt)}</p>

                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                    </div>) : <p>No reviews yet</p>
            }
        </div>

    </div>
  )
}

export default ReviewsCard