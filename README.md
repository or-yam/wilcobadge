# wilcobadge

A dynamic Wilco stats badge generator

## How to use 
Just use this url with your Wilco user-name inside an image tag:

```txt
https://wilcobadge.vercel.app/api/handler?wilconame=<YOUR WILCO USER-NAME>
```

### Example:

```html
<img src="https://wilcobadge.vercel.app/api/handler?wilconame=or-yam" />
```

<img src="https://wilcobadge.vercel.app/api/handler?wilconame=shem" />


### Info
Built with Typescript and deployed to Vercel edge functions.
The function fetch the user data from the Wilco API and generate SVG based on the user's data.


![info](https://user-images.githubusercontent.com/48219965/226166190-d3ca69f6-7ca0-4b56-a9f3-0d8a195aaa97.png)

```mermaid
 graph LR;
      Client==>Vercel-Function{{Vercel-Function}};
      Vercel-Function==>Wilco-API{{Wilco-API}};
      Wilco-API-->Vercel-Function;
      Vercel-Function-->Client;
      style Vercel-Function fill:#a4a4a7
      style Wilco-API fill:#dc30b3
      style Wilco-API color:#fff
      style Client fill:#5021ee
      style Client color:#fff
```
