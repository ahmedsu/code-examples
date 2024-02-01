import {useSelector} from 'react-redux';
import {APP_NAME, Events} from '@config';
import {Linking} from 'react-native';
import Share from 'react-native-share';
import {postInviteSent} from '@api';
import {useQueryClient} from 'react-query';
import {INVITE_SENT_COUNT_KEY} from '@config';
import {logEvent} from '@lib'

export const useInvite = () => {
  const queryClient = useQueryClient();

  const {id} = useSelector(({user}) => user.data);
  const link = `https://links.dishquo.com/OBd6/4ae8f2aa?p=join&r_id=${id}&af_force_deeplink=true`;
  const content = `JOIN ${APP_NAME.toUpperCase()}. ${APP_NAME.toUpperCase()} MAKES HEALTHY EATING EASY AND ENJOYABLE. START A FREE TRIAL ${link}`;

  const logSentInvite = async () => {
    await postInviteSent();
    queryClient.invalidateQueries([INVITE_SENT_COUNT_KEY]);
    logEvent(Events.referral_invite);
  };

  const sendSmsInvite = async recepients => {
    const url =
      Platform.OS === 'android'
        ? `sms:${recepients}?body=${content}`
        : `sms:/open?addresses=${recepients}&body=${content}`;

    Linking.openURL(url);
    await logSentInvite();
  };

  const shareInvitationLink = async () => {
    Share.open({
      subject: `Share ${APP_NAME}`,
      title: `Share ${APP_NAME}`,
      failOnCancel: false,
      message: content
    })
      .then(async res => {
        console.log(res);
        await logSentInvite();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return {sendSmsInvite, shareInvitationLink, link};
};
