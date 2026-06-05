export function Break(dark) {
    const color = dark ? "#1EA493" : "#74C9B5"
    return (
        <>
        
        <div className="grid grid-cols-[auto_auto] items-center w-full h-[60px] my-5 color-primary-light" aria-hidden="true">
            <div className="relative overflow-hidden h-full" aria-hidden="true">
                <div className="w-[800px] absolute left-0 top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M46.95,8.42c-.59,0-4.71-.04-5.5-.06l-1.17-.03c-1-.03-1.88-.07-2.54-.13-2.87-.25-5.58-.67-9.52-1.87-5.01-1.54-9.61-4.41-9.65-4.44-.27-.17-.63-.09-.8.18s-.09.63.18.8c.19.12,4.77,2.99,9.93,4.57,4.28,1.31,7.22,1.7,9.76,1.92,2.06.18,6.25.2,9.31.22h299.56v-1.17H46.95Z"/>   <path fill={color} d="M46.95,13.51c-.59,0-4.71.04-5.5.06l-1.17.03c-1,.03-1.88.07-2.54.13-2.87.25-5.58.67-9.52,1.87-5.01,1.54-9.61,4.41-9.65,4.44-.27.17-.63.09-.8-.18s-.09-.63.18-.8c.19-.12,4.77-2.99,9.93-4.57,4.28-1.31,7.22-1.7,9.76-1.92,2.06-.18,6.25-.2,9.31-.22h299.56v1.17H46.95Z"/>   <path fill={color} d="M27.52,10.96c0,.18-.07.35-.2.49l-.1.08-1.62,1.02c-7.18,4.51-16.47,4.52-23.65.01l-1.74-1.11c-.27-.27-.27-.71,0-.97l.1-.08,1.63-1.02c7.18-4.51,16.47-4.51,23.65,0l1.73,1.1c.13.13.2.31.2.49ZM1.59,10.96l.97.61c6.81,4.27,15.61,4.27,22.41-.01l.95-.6-.96-.6c-6.81-4.27-15.6-4.27-22.41,0l-.96.6Z"/>   <circle fill={color} cx="15.73" cy=".64" r=".64"/>   <circle fill={color} cx="15.73" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
            <div className="relative overflow-hidden h-full" aria-hidden="true">
                <div className="w-[800px] absolute right-0 top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M299.56,8.42c.59,0,4.71-.04,5.5-.06l1.17-.03c1-.03,1.88-.07,2.54-.13,2.87-.25,5.58-.67,9.52-1.87,5.01-1.54,9.61-4.41,9.65-4.44.27-.17.63-.09.8.18s.09.63-.18.8c-.19.12-4.77,2.99-9.93,4.57-4.28,1.31-7.22,1.7-9.76,1.92-2.06.18-6.25.2-9.31.22H0v-1.17h299.56Z"/>   <path fill={color} d="M299.56,13.51c.59,0,4.71.04,5.5.06l1.17.03c1,.03,1.88.07,2.54.13,2.87.25,5.58.67,9.52,1.87,5.01,1.54,9.61,4.41,9.65,4.44.27.17.63.09.8-.18s.09-.63-.18-.8c-.19-.12-4.77-2.99-9.93-4.57-4.28-1.31-7.22-1.7-9.76-1.92-2.06-.18-6.25-.2-9.31-.22H0v1.17h299.56Z"/>   <path fill={color} d="M318.99,10.96c0,.18.07.35.2.49l.1.08,1.62,1.02c7.18,4.51,16.47,4.52,23.65.01l1.74-1.11c.27-.27.27-.71,0-.97l-.1-.08-1.63-1.02c-7.18-4.51-16.47-4.51-23.65,0l-1.73,1.1c-.13.13-.2.31-.2.49ZM344.91,10.96l-.97.61c-6.81,4.27-15.61,4.27-22.41-.01l-.95-.6.96-.6c6.81-4.27,15.6-4.27,22.41,0l.96.6Z"/>   <circle fill={color} cx="330.78" cy=".64" r=".64"/>   <circle fill={color} cx="330.78" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
        </div>
        </>
    );
}

export function H1Middle({children, className}) {
    const color = "#74C9B5"
    return (
        <h1 className="grid grid-cols-[auto_max-content_auto] items-center w-full h-[60px] my-5 color-primary-light">
            <div className="relative overflow-hidden h-full" aria-hidden="true">
                <div className="w-[800px] absolute left-0 top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M46.95,8.42c-.59,0-4.71-.04-5.5-.06l-1.17-.03c-1-.03-1.88-.07-2.54-.13-2.87-.25-5.58-.67-9.52-1.87-5.01-1.54-9.61-4.41-9.65-4.44-.27-.17-.63-.09-.8.18s-.09.63.18.8c.19.12,4.77,2.99,9.93,4.57,4.28,1.31,7.22,1.7,9.76,1.92,2.06.18,6.25.2,9.31.22h299.56v-1.17H46.95Z"/>   <path fill={color} d="M46.95,13.51c-.59,0-4.71.04-5.5.06l-1.17.03c-1,.03-1.88.07-2.54.13-2.87.25-5.58.67-9.52,1.87-5.01,1.54-9.61,4.41-9.65,4.44-.27.17-.63.09-.8-.18s-.09-.63.18-.8c.19-.12,4.77-2.99,9.93-4.57,4.28-1.31,7.22-1.7,9.76-1.92,2.06-.18,6.25-.2,9.31-.22h299.56v1.17H46.95Z"/>   <path fill={color} d="M27.52,10.96c0,.18-.07.35-.2.49l-.1.08-1.62,1.02c-7.18,4.51-16.47,4.52-23.65.01l-1.74-1.11c-.27-.27-.27-.71,0-.97l.1-.08,1.63-1.02c7.18-4.51,16.47-4.51,23.65,0l1.73,1.1c.13.13.2.31.2.49ZM1.59,10.96l.97.61c6.81,4.27,15.61,4.27,22.41-.01l.95-.6-.96-.6c-6.81-4.27-15.6-4.27-22.41,0l-.96.6Z"/>   <circle fill={color} cx="15.73" cy=".64" r=".64"/>   <circle fill={color} cx="15.73" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
            <span className={"text-center mx-2 " + className}>{children}</span>
            <div className="relative overflow-hidden h-full" aria-hidden="true">
                <div className="w-[800px] absolute right-0 top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M299.56,8.42c.59,0,4.71-.04,5.5-.06l1.17-.03c1-.03,1.88-.07,2.54-.13,2.87-.25,5.58-.67,9.52-1.87,5.01-1.54,9.61-4.41,9.65-4.44.27-.17.63-.09.8.18s.09.63-.18.8c-.19.12-4.77,2.99-9.93,4.57-4.28,1.31-7.22,1.7-9.76,1.92-2.06.18-6.25.2-9.31.22H0v-1.17h299.56Z"/>   <path fill={color} d="M299.56,13.51c.59,0,4.71.04,5.5.06l1.17.03c1,.03,1.88.07,2.54.13,2.87.25,5.58.67,9.52,1.87,5.01,1.54,9.61,4.41,9.65,4.44.27.17.63.09.8-.18s.09-.63-.18-.8c-.19-.12-4.77-2.99-9.93-4.57-4.28-1.31-7.22-1.7-9.76-1.92-2.06-.18-6.25-.2-9.31-.22H0v1.17h299.56Z"/>   <path fill={color} d="M318.99,10.96c0,.18.07.35.2.49l.1.08,1.62,1.02c7.18,4.51,16.47,4.52,23.65.01l1.74-1.11c.27-.27.27-.71,0-.97l-.1-.08-1.63-1.02c-7.18-4.51-16.47-4.51-23.65,0l-1.73,1.1c-.13.13-.2.31-.2.49ZM344.91,10.96l-.97.61c-6.81,4.27-15.61,4.27-22.41-.01l-.95-.6.96-.6c6.81-4.27,15.6-4.27,22.41,0l.96.6Z"/>   <circle fill={color} cx="330.78" cy=".64" r=".64"/>   <circle fill={color} cx="330.78" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
        </h1>
    );
}

export function H1Left({children, className, stretch = false}) {
    const color = "#74C9B5"
    const isStretch = stretch ? "" : " md:w-[60%]"
    return (
        <h1 className={"grid grid-cols-[max-content_auto] items-center w-full h-[60px] my-5 color-primary-light" + isStretch}>
            <span className={"text-center mr-2 " + className}>{children}</span>
            <div className="relative overflow-hidden h-full" aria-hidden="true">
                <div className="w-[800px] absolute right-0 top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M299.56,8.42c.59,0,4.71-.04,5.5-.06l1.17-.03c1-.03,1.88-.07,2.54-.13,2.87-.25,5.58-.67,9.52-1.87,5.01-1.54,9.61-4.41,9.65-4.44.27-.17.63-.09.8.18s.09.63-.18.8c-.19.12-4.77,2.99-9.93,4.57-4.28,1.31-7.22,1.7-9.76,1.92-2.06.18-6.25.2-9.31.22H0v-1.17h299.56Z"/>   <path fill={color} d="M299.56,13.51c.59,0,4.71.04,5.5.06l1.17.03c1,.03,1.88.07,2.54.13,2.87.25,5.58.67,9.52,1.87,5.01,1.54,9.61,4.41,9.65,4.44.27.17.63.09.8-.18s.09-.63-.18-.8c-.19-.12-4.77-2.99-9.93-4.57-4.28-1.31-7.22-1.7-9.76-1.92-2.06-.18-6.25-.2-9.31-.22H0v1.17h299.56Z"/>   <path fill={color} d="M318.99,10.96c0,.18.07.35.2.49l.1.08,1.62,1.02c7.18,4.51,16.47,4.52,23.65.01l1.74-1.11c.27-.27.27-.71,0-.97l-.1-.08-1.63-1.02c-7.18-4.51-16.47-4.51-23.65,0l-1.73,1.1c-.13.13-.2.31-.2.49ZM344.91,10.96l-.97.61c-6.81,4.27-15.61,4.27-22.41-.01l-.95-.6.96-.6c6.81-4.27,15.6-4.27,22.41,0l.96.6Z"/>   <circle fill={color} cx="330.78" cy=".64" r=".64"/>   <circle fill={color} cx="330.78" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
        </h1>
    );
}

export function H2Middle({children, className}) {
    const color = "#1EA493"
    return (
        <h2 className="grid grid-cols-[auto_max-content_auto] items-center w-full h-[60px] my-5 color-primary-light">
            <div className="relative overflow-hidden h-full" aria-hidden="true">
                <div className="w-[800px] absolute left-0 top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M46.95,8.42c-.59,0-4.71-.04-5.5-.06l-1.17-.03c-1-.03-1.88-.07-2.54-.13-2.87-.25-5.58-.67-9.52-1.87-5.01-1.54-9.61-4.41-9.65-4.44-.27-.17-.63-.09-.8.18s-.09.63.18.8c.19.12,4.77,2.99,9.93,4.57,4.28,1.31,7.22,1.7,9.76,1.92,2.06.18,6.25.2,9.31.22h299.56v-1.17H46.95Z"/>   <path fill={color} d="M46.95,13.51c-.59,0-4.71.04-5.5.06l-1.17.03c-1,.03-1.88.07-2.54.13-2.87.25-5.58.67-9.52,1.87-5.01,1.54-9.61,4.41-9.65,4.44-.27.17-.63.09-.8-.18s-.09-.63.18-.8c.19-.12,4.77-2.99,9.93-4.57,4.28-1.31,7.22-1.7,9.76-1.92,2.06-.18,6.25-.2,9.31-.22h299.56v1.17H46.95Z"/>   <path fill={color} d="M27.52,10.96c0,.18-.07.35-.2.49l-.1.08-1.62,1.02c-7.18,4.51-16.47,4.52-23.65.01l-1.74-1.11c-.27-.27-.27-.71,0-.97l.1-.08,1.63-1.02c7.18-4.51,16.47-4.51,23.65,0l1.73,1.1c.13.13.2.31.2.49ZM1.59,10.96l.97.61c6.81,4.27,15.61,4.27,22.41-.01l.95-.6-.96-.6c-6.81-4.27-15.6-4.27-22.41,0l-.96.6Z"/>   <circle fill={color} cx="15.73" cy=".64" r=".64"/>   <circle fill={color} cx="15.73" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
            <span className={"text-center mx-2 " + className}>{children}</span>
            <div className="relative overflow-hidden h-full top-1" aria-hidden="true">
                <div className="w-[800px] absolute right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M299.56,8.42c.59,0,4.71-.04,5.5-.06l1.17-.03c1-.03,1.88-.07,2.54-.13,2.87-.25,5.58-.67,9.52-1.87,5.01-1.54,9.61-4.41,9.65-4.44.27-.17.63-.09.8.18s.09.63-.18.8c-.19.12-4.77,2.99-9.93,4.57-4.28,1.31-7.22,1.7-9.76,1.92-2.06.18-6.25.2-9.31.22H0v-1.17h299.56Z"/>   <path fill={color} d="M299.56,13.51c.59,0,4.71.04,5.5.06l1.17.03c1,.03,1.88.07,2.54.13,2.87.25,5.58.67,9.52,1.87,5.01,1.54,9.61,4.41,9.65,4.44.27.17.63.09.8-.18s.09-.63-.18-.8c-.19-.12-4.77-2.99-9.93-4.57-4.28-1.31-7.22-1.7-9.76-1.92-2.06-.18-6.25-.2-9.31-.22H0v1.17h299.56Z"/>   <path fill={color} d="M318.99,10.96c0,.18.07.35.2.49l.1.08,1.62,1.02c7.18,4.51,16.47,4.52,23.65.01l1.74-1.11c.27-.27.27-.71,0-.97l-.1-.08-1.63-1.02c-7.18-4.51-16.47-4.51-23.65,0l-1.73,1.1c-.13.13-.2.31-.2.49ZM344.91,10.96l-.97.61c-6.81,4.27-15.61,4.27-22.41-.01l-.95-.6.96-.6c6.81-4.27,15.6-4.27,22.41,0l.96.6Z"/>   <circle fill={color} cx="330.78" cy=".64" r=".64"/>   <circle fill={color} cx="330.78" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
        </h2>
    );
}

export function H2Left({children, className, stretch = false}) {
    const color = "#1EA493"
    const isStretch = stretch ? "" : " md:w-[60%]"
    return (
        <h2 className={"grid grid-cols-[max-content_auto_103px] items-center w-full h-[60px] my-5 color-primary-light" + isStretch}>
            <span className={"text-center mr-2 " + className}>{children}</span>
            <div className="relative overflow-hidden h-full top-1" aria-hidden="true">
                <div className="w-[800px] absolute right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 347 22">   <path fill={color} d="M299.56,8.42c.59,0,4.71-.04,5.5-.06l1.17-.03c1-.03,1.88-.07,2.54-.13,2.87-.25,5.58-.67,9.52-1.87,5.01-1.54,9.61-4.41,9.65-4.44.27-.17.63-.09.8.18s.09.63-.18.8c-.19.12-4.77,2.99-9.93,4.57-4.28,1.31-7.22,1.7-9.76,1.92-2.06.18-6.25.2-9.31.22H0v-1.17h299.56Z"/>   <path fill={color} d="M299.56,13.51c.59,0,4.71.04,5.5.06l1.17.03c1,.03,1.88.07,2.54.13,2.87.25,5.58.67,9.52,1.87,5.01,1.54,9.61,4.41,9.65,4.44.27.17.63.09.8-.18s.09-.63-.18-.8c-.19-.12-4.77-2.99-9.93-4.57-4.28-1.31-7.22-1.7-9.76-1.92-2.06-.18-6.25-.2-9.31-.22H0v1.17h299.56Z"/>   <path fill={color} d="M318.99,10.96c0,.18.07.35.2.49l.1.08,1.62,1.02c7.18,4.51,16.47,4.52,23.65.01l1.74-1.11c.27-.27.27-.71,0-.97l-.1-.08-1.63-1.02c-7.18-4.51-16.47-4.51-23.65,0l-1.73,1.1c-.13.13-.2.31-.2.49ZM344.91,10.96l-.97.61c-6.81,4.27-15.61,4.27-22.41-.01l-.95-.6.96-.6c6.81-4.27,15.6-4.27,22.41,0l.96.6Z"/>   <circle fill={color} cx="330.78" cy=".64" r=".64"/>   <circle fill={color} cx="330.78" cy="21.29" r=".64"/> </svg>
                </div>
            </div>
        </h2>
    );
}

export function Banner({className, children, type = "green"}) {
    let color = "bg-primary-dark";
    let discOpacity = "opacity-100";
    if (type == "blue") {
        color = "bg-secondary-light";
        discOpacity = "opacity-50";
    } else if (type == "dark") {
        color = "bg-secondary-dark";
        discOpacity = "opacity-40";
    }

    return (
        <div className={className + " banner relative w-full lg:px-40 px-10 py-20 overflow-hidden duration-200 " + color}>
            <div className="absolute top-0 left-0 w-full z-0">
                <div className={"relative w-full " + discOpacity}>
                    <img className="absolute w-50 -top-20 -right-15" src="/assets/landing-disc-2a.svg" alt="" aria-hidden="true" />
                    <img className="absolute w-60 top-15 -left-30 -rotate-20" src="/assets/landing-disc-4b.svg" alt="" aria-hidden="true" />
                </div>
            </div>
            <div className="banner-content relative z-1 text-white">
                {children}
            </div>
        </div>
    )
}
