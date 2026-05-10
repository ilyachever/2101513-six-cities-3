import {ChangeEvent, FormEvent, useState} from 'react';
import {RATING_STARS} from '../../const.ts';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {saveCommentAction} from '../../store/api-actions';
import {getIsCommentSaving} from '../../store/offers-data/selectors';

const MIN_REVIEW_LENGTH = 50;
const MAX_REVIEW_LENGTH = 300;

type ReviewFormProps = {
  offerId: string;
}

function ReviewForm({offerId}: ReviewFormProps) {
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    review: ''
  });
  const dispatch = useAppDispatch();
  const isCommentSaving = useAppSelector(getIsCommentSaving);

  const handleReviewFormFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setReviewFormData({...reviewFormData, [name]: name === 'rating' ? Number(value) : value});
  };

  const handleFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const result = await dispatch(saveCommentAction({
      offerId: offerId,
      comment: reviewFormData.review,
      rating: Number(reviewFormData.rating)
    }));
    if (saveCommentAction.fulfilled.match(result)) {
      setReviewFormData({
        rating: 0,
        review: ''
      });
    }
  };

  const isFormValid = reviewFormData.review.length >= MIN_REVIEW_LENGTH
    && reviewFormData.review.length <= MAX_REVIEW_LENGTH
    && reviewFormData.rating > 0;
  const isFormDisabled = isCommentSaving;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={(evt) => void handleFormSubmit(evt)}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {RATING_STARS.map(({value, title}) => (
          <>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              onChange={handleReviewFormFieldChange}
              disabled={isFormDisabled}
              checked={reviewFormData.rating === value}
            />
            <label htmlFor={`${value}-stars`} className="reviews__rating-label form__rating-label" title={title}>
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </>
        ))}
      </div>
      <textarea className="reviews__textarea form__textarea"
                id="review"
                name="review"
                value={reviewFormData.review}
                placeholder="Tell how was your stay, what you like and what can be improved"
                onChange={handleReviewFormFieldChange}
                disabled={isFormDisabled}/>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b
          className="reviews__text-amount">{MIN_REVIEW_LENGTH} characters</b>.
        </p>
        <button className="reviews__submit form__submit button"
                type="submit"
                disabled={!isFormValid || isFormDisabled}>Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
