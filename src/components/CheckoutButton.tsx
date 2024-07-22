import { useAuth0 } from "@auth0/auth0-react"
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { UserFormData } from "../forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "../api/MyUserAPI";

type Props = {
    onCheckout: (userFormData: UserFormData) => void;
    disabled: boolean;
    isLoading: boolean;
}

export default function CheckoutButton({ onCheckout, disabled, isLoading }: Props) {
    const { isLoading: isAuthLoading, isAuthenticated, loginWithRedirect } = useAuth0();
    const { pathname } = useLocation();

    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

    const onLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: pathname
            }
        });
    }

    if (!isAuthenticated) {
        return (
            <Button onClick={onLogin} className="bg-orange-500 flex-1">Log in to checkout</Button>
        )
    }

    if (isAuthLoading || !currentUser || isLoading) {
        return (
            <LoadingButton />
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled} className="bg-orange-500 flex-1">Go to checkout</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
                <UserProfileForm currentUser={currentUser} onSave={onCheckout} isLoading={isGetUserLoading} buttonText="Continue to pay" title="Confirm delivery details" />
            </DialogContent>
        </Dialog>
    )
}
