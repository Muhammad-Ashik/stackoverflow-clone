import { Request, Response, Router } from 'express'
import { HTTP_STATUS, PAGINATION } from '../../constants'
import { asyncHandler } from '../../middleware/error.middleware'
import QuestionService, {
  CreatQuestionInfo,
} from '../../services/question/QuestionService'

const router = Router()

router.post(
  '/create-question',
  asyncHandler(async (req: Request, res: Response) => {
    const { description, title, userId } = req.body as CreatQuestionInfo

    const question = await QuestionService.CreateQuestion({
      description,
      title,
      userId,
    })

    res.status(HTTP_STATUS.CREATED).json(question)
  }),
)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(
      PAGINATION.DEFAULT_PAGE,
      parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE,
    )
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(
        PAGINATION.MIN_LIMIT,
        parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
      ),
    )
    const questions = await QuestionService.getQuestions({
      page,
      limit,
    })

    res.status(HTTP_STATUS.OK).json(questions)
  }),
)

export default router
