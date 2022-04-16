import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button  } from 'react-native';
import { Audio } from 'expo-av';
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from 'expo-ads-admob';

export default function App() {

  const [sound, setSound] = React.useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({
      uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
    setSound(sound);

    await sound.playAsync();
  }

  async function stopSound() {
    await sound.stopAsync()
  }

  React.useEffect(() => {
    return sound
        ? () => {
          sound.unloadAsync(); }
        : undefined;
  }, [sound]);

  async function popAd() {
    await AdMobInterstitial.setAdUnitID('ca-app-pub-1686394253591485/6567582620');
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
    await AdMobInterstitial.showAdAsync();
  }

    async function rewardedAd() {
        await AdMobRewarded.setAdUnitID('ca-app-pub-1686394253591485/4349694963');
        await AdMobRewarded.requestAdAsync();
        await AdMobRewarded.showAdAsync();
    }

  return (
    <View style={styles.container}>
      <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-1686394253591485/2142086604"
          servePersonalizedAds />
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Play Sound" onPress={playSound} />
      <Button title="Stop Sound" onPress={stopSound} />

      <Button title="Pop Ad" onPress={popAd} />
        <Button title="Rewarded Ad" onPress={rewardedAd} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
