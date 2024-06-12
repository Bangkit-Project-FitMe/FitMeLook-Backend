# FitMeLook API Documentation

## Users API [/users/:user_id]

### List user data [GET]

#### Response:

```json
{
Status: success,
message: Successfully GET ${user_id} data.,
data: {
	user_id: string,
	email: string,
	nama: string,
	created_at: string,
}
```

## Predictions API [/users/:user_id/predictions]

### List user all predictions data [GET]

```json
{
    status: success,
    message: User predictions retrieved successfully.,
    data: [
        {
            prediction_id: string,
            face_shape: string,
            seasonal_type: string,
            face_shape_confidence_score: number,
            seasonal_type_confidence_score: number
            image_url: string,
            created_at: date,
            response_images: string[],
        },
        {
            prediction_id: string,
            face_shape: string,
            seasonal_type: string,
            face_shape_confidence_score: number,
            seasonal_type_confidence_score: number
            image_url: string,
            created_at: date,
            response_images: string[],
        },
    ]
}
```

## Specific Prediction API [/users/:user_id/predictions/:prediction_id]

### List user prediction data by prediction_id [GET]

```json
{
    status: success,
    message: Prediction details retrieved successfully.,
    data: {
        prediction_id: string,
        face_shape: string,
        seasonal_type: string,
        face_shape_confidence_score: number,
        seasonal_type_confidence_score: number,
        image_url: string,
        created_at: date,
        response_images: string[],
    },
}
```

## Predict API [/users/:user_id/predict]

### user predict [POST]

#### Input:

```json
//  berupa gambar dengan key `image`
{
  fieldname: 'image',
  originalname: <image_name>.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: <Buffer ff d8 ff db 00 43 00 ... 185681 more bytes>,
  size: 185731
}
```

#### Response:

```json
{
    status: success,
    message: Prediction details retrieved successfully..,
    data: {
        prediction_id: string,
        face_shape: string,
        seasonal_type: string,
        face_shape_confidence_score: number,
        seasonal_type_confidence_score: number
        image_url: string,
        created_at: date,
        response_images: string[],
    },
}
```

## Register API [/register]

### Register user account to the database [POST]

#### Input:

```json
{
  full_name: string,
  email: string,
  password: string,
}
```

#### Response:

```json
{
    status: string,
    message: string,
}
```
