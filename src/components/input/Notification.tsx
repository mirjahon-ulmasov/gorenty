import { useAppDispatch } from 'hooks/redux'
import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { setFirebaseToken } from 'store/reducers/authSlice'
import { requestPermission, onMessageListener } from 'utils/firebase'

export const Notification = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        async function getToken() {
            const token = (await requestPermission()) || ''
            dispatch(setFirebaseToken(token))
        }
        getToken()

        const unsubscribe = onMessageListener().then(payload => {
            toast.success(
                `${payload?.notification?.title}: ${payload?.notification?.body}`,
                { duration: 60000, position: 'top-right' }
            )
        })
        return () => {
            unsubscribe.catch(err => console.log('failed: ', err))
        }
    }, [dispatch])

    return <Toaster />
}
