# Polarity Zscaler Integration

![image](https://img.shields.io/badge/status-beta-green.svg)

Zscaler Internet Access (ZIA) is a cloud-based security solution that provides secure and direct access to the internet for users,
protecting against cyber threats and ensuring compliance with organizational policies. It includes features such as web filtering, threat protection, and secure access service edge (SASE) capabilities.

To learn more about Zscaler, visit the [official website](https://www.zscaler.com/).

The Polarity-Zscaler integration allows users to add or remove URLs from ZScaler URL categories. 

## Zscaler Integration Options

### Zscaler API URL

The URL for your Zscaler API instance. The URL should include the scheme (https://).  Example values for this are:

```
https://zsapi.zscalerbeta.net
https://zsapi.zscalerone.net
https://zsapi.zscalertwo.net
https://zsapi.zscalerthree.net
https://zsapi.zscaler.net
https://zsapi.zscloud.net
```

### ZScaler Username

Enter the username for your ZScaler account.

### ZScaler Password

Enter the password associated with your ZScaler username.

### Zscaler API Token

Enter the Zscaler API Token associated with your Zscaler account.

### URL Categories

A comma separated list of Zscaler category IDs that URLs can be added to or removed from. The first category in the list will be used as the default category.  You can also add a user-friendly label to the category by prepending the category with a label and using a colon to separate it from the category ID (i.e., `<label>:<categoryId>`). Note that the name of the category is not the same as the category's ID.  See the integration README for information on finding the category ID. This option must be set to "Users can view only".

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making. For more information about the Polarity platform please see:

https://polarity.io/
