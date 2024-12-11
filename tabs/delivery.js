import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SelectOffer({ navigation,route }) {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const {user } = route.params; 
    const offers = [
        { id: 1, title: '10%', icon: 'phone-android' },
        { id: 2, title: '-$1 shipping free', icon: 'motorcycle' },
        { id: 3, title: '-10% for E-wallet', icon: 'account-wallet' },
        { id: 4, title: '-30% for bill over $50', icon: 'credit-card' },
        { id: 5, title: 'Freeship', icon: 'motorcycle' }
    ];

    const handleSelectOffer = (offerId) => {
        setSelectedOffer(offerId);
    };

    const handleUseNow = () => {
        const selectedOfferDetails = offers.find((offer) => offer.id === selectedOffer);
        if (selectedOfferDetails) {
            navigation.navigate('Order', { selectedOffer: selectedOfferDetails, user });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select offer</Text>

            {offers.map((offer) => (
                <TouchableOpacity
                    key={offer.id}
                    style={styles.offerContainer}
                    onPress={() => handleSelectOffer(offer.id)}
                >
                    <View style={styles.offerContent}>
                        <Icon name={offer.icon} size={24} color="#c061d3" style={styles.icon} />
                        <Text style={styles.offerText}>{offer.title}</Text>
                    </View>
                    {selectedOffer === offer.id && (
                        <Icon name="radio-button-checked" size={24} color="#00C1D4" />
                    )}
                    {selectedOffer !== offer.id && (
                        <Icon name="radio-button-unchecked" size={24} color="#D1D1D6" />
                    )}
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.useButton} onPress={handleUseNow}>
                <Text style={styles.useButtonText}>Use now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    offerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        justifyContent: 'space-between',
    },
    offerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    offerText: {
        fontSize: 14,
    },
    useButton: {
        backgroundColor: '#00C1D4',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    useButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
