import { BallTriangle } from 'react-loader-spinner'
import Header from '../../components/Header'

export const LoaderPage = () => {
  return (
    <>
        <Header />
        <div className="flex items-center justify-center h-screen">
        <BallTriangle
            height={200}
            width={200}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            visible={true}
        />
        </div>
    </>
  )
}
