import { useEffect } from "react";

const TawkChat = () => {
    useEffect(() => {
        const script = document.createElement("script");
        if (typeof window !== "undefined") {
            script.src = "https://embed.tawk.to/67c26c3780472519099dedc9/1il7nder6";
            script.async = true;
            script.charset = "UTF-8";
            script.setAttribute("crossorigin", "*");
            document.body.appendChild(script);
        }
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // Không cần render gì cả, chỉ cần chạy script
};

export default TawkChat;

// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
//     var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
//     s1.async=true;
//     s1.src='https://embed.tawk.to/67c26c3780472519099dedc9/1il7nder6';
//     s1.charset='UTF-8';
//     s1.setAttribute('crossorigin','*');
//     s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->

// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
//     var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
//     s1.async=true;
//     s1.src='https://embed.tawk.to/67c70051e20d16190f6c6943/1ilgliga0';
//     s1.charset='UTF-8';
//     s1.setAttribute('crossorigin','*');
//     s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->