import {uiActions} from "./ui-slice";
import {cartActions} from "./cart-slice";

export const fetchCartData = () => {
    return async dispatch => {
        const fetchData = async () => {
            const response = await fetch(
                'https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
            );
            if (!response.ok) {
                throw new Error("Could not fetch cart data!");
            }
            return await response.json();
        };
        try {
            const cartData = await fetchData();
            dispatch(cartActions.replaceCart({
                    items: cartData.items || [],
                    totalQuantity: cartData.totalQuantity,
                    totalAmount: cartData.totalAmount
                }
            ));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Fetching cart data!'
            }));
        }
    }
}

export const sendCardData = (cart) => {
    return async (dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'Sending...',
            message: 'Sending cart data!'
        }));
        const sendRequest = async () => {
            const response = await fetch('https://react-http-25001-default-rtdb.europe-west1.firebasedatabase.app/cart.json', {
                method: 'PUT',
                body: JSON.stringify({
                    totalAmount: cart.totalAmount,
                    totalQuantity: cart.totalQuantity,
                    items: cart.items
                })
            });
            if (!response.ok) {
                throw new Error('Sending cart data failed!');
            }
        }
        try {
            await sendRequest();
            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success!',
                message: 'Sent cart data successfully!'
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!',
                message: 'Sent cart data failed!'
            }));
        }
    };
};