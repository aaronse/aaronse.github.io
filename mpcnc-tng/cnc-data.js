/* cnc-data.js */

/**
 * Data for ~40 CNC machines, each with:
 *  - name, minCost, maxCost, avgCost
 *  - minArea, maxArea
 *  - url (direct product link)
 *  - features (notable advantages or highlights)
 *  - iconUrl (small .ico or similar to display in the chart)
*/
var cncData = [
  {
    name: "V1 Engineering MPCNC Primo",
    minCost: 450, maxCost: 800, avgCost: 577,
    minArea: 1, maxArea: 9,
    url: "https://www.v1e.com/products/mostly-printed-cnc-parts-bundle-primo-version",
    features: "Highly customizable DIY CNC with 3D-printed parts, large community.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADUUlEQVR4AWIgFwBKLwdYSYMYjp9tBGcjONt3sc9WdLZt2wrOZnS2bSs4B2cuOtdk2+z/NfPeWyW/zLcfpp2203ZcSrLImJXZyzgmxIQpQ4a/PJLce87/2zP6XeZkhWdkMst1WeaWCAqqUCCk16zAER6ru2RWr4KFNsxXmTwgwlWBNcxyYqXkfwCUmpDUqnnSbMxypxOKEBC2ickgJq/BvJb7/1SZdAWrvwh8LTRnHspEYcHB+J2/KSnv5pDv51Pk2V9553raggVKae4iYlYnBCilvwNihUkmQHMxj+SZWmCdV7g1NUT4EOaTfEwQWKSBJgJe8pgTFeB749Q94KK+KhBXnAkE6wS9mccQxRjlRAIo1JUic2aVOYpTNEjDjLqplU+oUoAZoGYTguBjQktQ1K/nGLtTNngU/8FUVFOj4FrMEua9EazmRcFqSqSRukzGevA+wQLeMrlVaFWeeARzSR5awWhmJ9dhMOk9vr7B41CwqM590mxRddNdJmoeg5qaLKgIs1v2dyaNIWP6jhCcJKglj6gCKDQgBH0QA5lsmnFdJgG37xWY27ptmyoQJvQNQzKmwUHcqmb1GFfbPLUhKPOvUgVQ+F1+OIHHiR4mMJP4+SgeC+mqVbj+zP06JgAxTc9HBVS7OiYnpEVGK9zkFM1+z02KVhfOJHUB7kv5MCeT3Qcx6mtKu3CpJa5i9FNUgenksUBdisEChH72K5DRWoA8FvDFwD2XRgyQJwasEuZ+XRsDDmIAXABKxMYhwoIV2y5w5nqVNw9A9guSXANB8OFUj0tsQoopD6y3KxTBYZP5yGPOPUwNGx/+TGgrpmbCCFWYEcxFXy1QgTgSdEAU6YyuOX8tOGH2v6kFAEWr4WJbDYk/NHWAdFKETDUkrYZGcVsNM5K/H+jPPDSK+PqBMPNPFDjH2KK0Xq1Aph/wZTBfR9TLNia2IzItWjdjheI8flGXYUcUb084WHtCDSi9Nv7FnjCrjONAeegJYzsLYMUryqwVwZrZyFgHu+KspFlR+0rbFceohO9c8MDTaGqn9N3BuUBcMc+Zc0Gy58GszpyMzLgZvqupJyPyn4ziVsSeDb84cAmZsyG4JgBbdkLSp2OKnhPL8Xjb7BKyp2PhqGbQ/+PFaPf5D3n2AAAAAElFTkSuQmCC"
  },
  {
    name: "V1 Engineering LowRider 4",
    minCost: 700, maxCost: 1500, avgCost: 800,
    minArea: 1, maxArea: 50,
    url: "https://www.v1e.com/products/lowrider-v4-hardware-kit",
    features: "Designed for full-sheet cutting (4×8+). Highly scalable and DIY-friendly.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADUUlEQVR4AWIgFwBKLwdYSYMYjp9tBGcjONt3sc9WdLZt2wrOZnS2bSs4B2cuOtdk2+z/NfPeWyW/zLcfpp2203ZcSrLImJXZyzgmxIQpQ4a/PJLce87/2zP6XeZkhWdkMst1WeaWCAqqUCCk16zAER6ru2RWr4KFNsxXmTwgwlWBNcxyYqXkfwCUmpDUqnnSbMxypxOKEBC2ickgJq/BvJb7/1SZdAWrvwh8LTRnHspEYcHB+J2/KSnv5pDv51Pk2V9553raggVKae4iYlYnBCilvwNihUkmQHMxj+SZWmCdV7g1NUT4EOaTfEwQWKSBJgJe8pgTFeB749Q94KK+KhBXnAkE6wS9mccQxRjlRAIo1JUic2aVOYpTNEjDjLqplU+oUoAZoGYTguBjQktQ1K/nGLtTNngU/8FUVFOj4FrMEua9EazmRcFqSqSRukzGevA+wQLeMrlVaFWeeARzSR5awWhmJ9dhMOk9vr7B41CwqM590mxRddNdJmoeg5qaLKgIs1v2dyaNIWP6jhCcJKglj6gCKDQgBH0QA5lsmnFdJgG37xWY27ptmyoQJvQNQzKmwUHcqmb1GFfbPLUhKPOvUgVQ+F1+OIHHiR4mMJP4+SgeC+mqVbj+zP06JgAxTc9HBVS7OiYnpEVGK9zkFM1+z02KVhfOJHUB7kv5MCeT3Qcx6mtKu3CpJa5i9FNUgenksUBdisEChH72K5DRWoA8FvDFwD2XRgyQJwasEuZ+XRsDDmIAXABKxMYhwoIV2y5w5nqVNw9A9guSXANB8OFUj0tsQoopD6y3KxTBYZP5yGPOPUwNGx/+TGgrpmbCCFWYEcxFXy1QgTgSdEAU6YyuOX8tOGH2v6kFAEWr4WJbDYk/NHWAdFKETDUkrYZGcVsNM5K/H+jPPDSK+PqBMPNPFDjH2KK0Xq1Aph/wZTBfR9TLNia2IzItWjdjheI8flGXYUcUb084WHtCDSi9Nv7FnjCrjONAeegJYzsLYMUryqwVwZrZyFgHu+KspFlR+0rbFceohO9c8MDTaGqn9N3BuUBcMc+Zc0Gy58GszpyMzLgZvqupJyPyn4ziVsSeDb84cAmZsyG4JgBbdkLSp2OKnhPL8Xjb7BKyp2PhqGbQ/+PFaPf5D3n2AAAAAElFTkSuQmCC"
  },
  {
    name: "Maslow CNC",
    minCost: 525, maxCost: 525, avgCost: 525,
    minArea: 1, maxArea: 50,
    url: "https://www.maslowcnc.com/shop/p/maslow-41-kit-pre-order",
    features: "Unique vertical-hanging design for large plywood sheets on a budget.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEyrfMGrfMGrfMGrfMGrfMGrfMGrfMGrfMGrfMGqesCodr+mcr2yh8bKrtjh0ejq3/D////07vfWwOC+ms+rfMH6xU6KAAAAFnRSTlMAUprQ9/8eqY7i//////////////9Gfq6LwgAAAXNJREFUeAFsUleiwzAIa4bTxuAB8bv/VZ+AdJcPT4HEuLzYNC9rSusyT5cftl3Ti123z/9b+rDbu/uevmzfXv7XeMtEzEQ5buv28Z+51NZbq4nzOyLiU+kiooqlFXbM8qIv8yFyFKbKxU5a8l3p5v7cpIGdu0BJbiIOSEbi+cP/YNBUUWxccXPADIATFGnsG3bfxhkC9fUAXSg2qZRIAZPO9vN3mSPAQU7QpbjcguWUuRig2g2w3oRpCLxxqeSZrp6CshNkbZzVeViaAfZLSFA2gpqkWr5ib+oi1hPgMTuDCjDcXgBGQaAAgVUrA+aKQcFOsRjgkAxPYm2AubynyDPNEcoVz/5F9UwzCpW8B3lEIbHQs1BR6mo/YNLshK02GVHqaBZb7ox1GK8103sXzdruHAdrvDLXkgwZ7XaZPhA62CxXk/o62nsgBni0d1udyYoQFiSJeBxdtR/jc2gd4RBi2PfY/49gxkG4FDPrEc68BLM/AHsXH8p3seW/AAAAAElFTkSuQmCC"
  },
  {
    name: "Sienci LongMill (30×30)",
    minCost: 1460, maxCost: 1460, avgCost: 1460,
    minArea: 6.25, maxArea: 6.25,
    url: "https://sienci.com/product/longmill-30x30/",
    features: "Canadian-designed open-source kit, robust rails for woodworking.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAeFBMVEVHcExgYGAAAABISEhsbGwAAACKiooAAAAAAAAAAAAQEBBoaGgAAAAAAAAuLi59fX3///+hoaHx8fGVlZVqamqOjo6Dg4N3d3f4+Pj9/f26urro6Ojg4ODZ2dnHx8eqqqqcnJzOzs6mpqZaWlqvr6+srKwsLCw/Pz+GFRXNAAAAEHRSTlMA7RXe8IPrWiw7l8RPbsLe3Ks+swAAAS5JREFUKJF1k+l2hCAMhZm6O9Np2BVcZ2nf/w1LwAXt6f2BRz9uSEIkZFVVX3PO82tWkrM+UwleoxzS4oDKi20ookF0bu2Tj50VTwDmoBUm2EFWGzO96JoHSI7f2xZXutASA1ItFHMkYPeQIfLFB2LfLzgoQZYxv5WNVsywePHRY84qvGFCRrPImhJy63boTpI7HEpSQwyBabPRjHwdIbSzCLEadSd8ST1An85DN642BTkZT06/RU7a2bmHuzN4mXrqGeH018klTGAEy5f+RNAI67gLwO+kViaGVgze3PpSbnYW/QpbtZyC0DUB24e5I3xt7UOYhsa7gmkzdj7CBrtiuzIrft6+jHaFSXTZ6g2R+HrZy5jQGFJanQdsl95YNJpBh9GMh9rVdxrqf36HX2zZLDfUedcoAAAAAElFTkSuQmCC"
  },
  {
    name: "Sainsmart Genmitsu 3018-PRO",
    minCost: 200, maxCost: 200, avgCost: 200,
    minArea: 0.5, maxArea: 0.5,
    url: "https://www.sainsmart.com/products/sainsmart-genmitsu-cnc-router-3018-pro-diy-kit",
    features: "Budget-friendly 3018-class CNC for beginners, large community.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX///8zm8sll8kNkscalMjQ5PD2+vwtmcrw9vrg7fVustaPwt7r8/mTxN/Y6fPK4e4/n8262OqozuV/utoAjsVQpdB2ttibyOFeq9PB3OwAisOu0uaakzjnAAABOElEQVQ4ja1T2ZaFIAyjC9Z9R9H5//8cRC7K1XmbPPWcBGiTotT/Imu7rs3+YvO1J3agfs3f+IpQwEOQqgddCMINKEXKaxJIIKTvfE3wANU3Qf/kAfqLH/FNgGMUsLwJhD/8YMunRNiaIQjKTW2IiUQQNzWUQYDr0QdctwjD8f6KQUBnv7oy3mo21emBoZABczQlz+uYlWY+M8n4M/Ksa1aDRHM4iAlw8oVd1DwU+xnDhBCeUAaAGz/vrBarwNcNA5ggaJyRvBzVvuk9G4+Di+OxCYKCj9HE2TK2qsyzH9fHMTLHyI344aXRboa6W8VbIjZm0Z5pi3gbWE7HqL3irF7i5GTt7EOBViWw/HW+VF9Y6XYJ0vjNu72crjSn14/RxSuwe+Pvm51s9AflbaXk0aILPfkaFLfiFzpqCsc5b/5tAAAAAElFTkSuQmCC"
  },
  {
    name: "FoxAlien Masuter 4040 💀",
    minCost: 400, maxCost: 400, avgCost: 400,
    minArea: 0.8, maxArea: 0.8,
    url: "https://www.foxalien.com/products/cnc-router-machine-masuter",
    features: "Affordable mid-size CNC with stiff rails, good for wood & soft materials.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAMAAAAynjhNAAAAdVBMVEVHcEx5Sy7/gRL/lDT/hBbgaw7/hRb/hxX/kyldMRPMbAr/hRj/hxabVAuMRQ//hxn/hhcFAADrfQ//hRT/hRn/hxe0XAb/jxUAAAD/iBb/gxhXKACCPgQuCQBEIQBGHQAAAABVIwBXIwBaJABVKQBPIABVKQB8FMVtAAAAJ3RSTlMABTsHI+VQdxCu/57X/nLpuP3/Yor0////////////b8o+Vy0ZlK9wD4DVAAABXElEQVR4AYySB3aEIBBAGSBKxI2GIoxxCxhz/yNmTLGl/l3rn/qe7B/A75ZzdkBwuebyu0LsbXmn2McrXqj7SqtNNVmfHlTxUVI2TftoGitAzIByvnusvRXs04dTNL51WmvnXI1VrEJJdvEYT9h7+s2EpxhKtoH7zvQLWHVuv2tBeRvfCrZDNf2Wo6Zs3Ggvd1boHsOnpztv97VrHM4VvssuDqjFfnKM50geZ3s+h0ZtLDja9XyOBhFNfDoP6Pmudo+GkoaA4XI+nxGp+k5T2SFGE6oYB7L7zZWjxUJf9cF0JiA29rC41BQwQ9KXih0RsvXvUi9yCwheV51ppWA/oK63RPJHANg3CCFWD8cYKF3BpCAgZ8jjCM9A/6VlW3PeWqktmybIaUwvKU0JFq2Vs46jG6cpp5yvU0r5mpaPXrKitby0OSXSY7pCSmlcRptLADHfzCcxX4C9jlIAAMFqIQCgdZbRAAAAAElFTkSuQmCC"
  },
  {
    name: "BobsCNC E3",
    minCost: 500, maxCost: 500, avgCost: 500,
    minArea: 1, maxArea: 1,
    url: "https://www.bobscnc.com/products/e3-cnc-engraver-kit",
    features: "Plywood frame kit, easy to modify, excellent for hobby woodworking.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABKVBMVEVHcEzp5d6kmpSMdGCto5nNx8H39fLr6ebRzMjr6umtk3jEvrmSemaccEGhd0rHu66oknzPtpnt5t3DvLN7bWWWioWqiWaljXmHWCdLOjWBY0TNm1e4nHjYxKi3mnqliWq1oY2kjHPFpH6kgly8lmjCvbi1oIuopKJ/cWuoqKiDX0OacEaff1e3oIPSrHqbc0lrSTJZNx9lYWB8ZVidajFOOS+FdWNhU0etpKCSdlvLmjzcqFXZpFLcqljbplLTnk7GkUVyUjJ7WThnRSxzSivgrFfWoVLVo2LOmEm7h0GUbEOPZTymdTmGYDmygUiWZjFpPRzirmGIZUKvfTuwei+mbizNmFCwglLEdwrCkFK+iDxEKBlzRyWFThOxbAaaWBHOnmkOBgbghQC3RFvCAAAAO3RSTlMAKl7QCkoZAxMMlTy5/vxZWp07Z6KN2an96N/0cn/CvIDOx8zmJqV3uTPt3+9L4vDz/qzc8Ptv94He017tKn0AAAGlSURBVCiRhZLnctpQFISvJFQRvYPpHdxn7BT13oXouCd5/4eI7MQeEUiyf7+5e3d2DwD/FU78A6avMUAS+FFGXH+H+2j8+PP4aETn0NT48DuIAHClUkHxOBo7hFi2NKo+5cE4d+CLYwDKfP76ozssjPFYqGgsHIVhpLzblW+QwaBRLHZSEUi2vUdZXr+ok9KUKj7N3JMIjH1xVVV5CW4mdJWeBo/JPYjMgodg91xGmiWKql5N0vvwsqKsnqdxgsRBb3bRIiOBaK8K96ECCchsPeNbm1ovk/2oLi9LSgtFOj1/uVrdi6bY6Ojnmexb08NPnnRlO+v12l1aoinoQq2m6XPjvA6nADbsyg+q4/uWKJqmIOgsw/Lc3JgbXvu19tv8pZLY3m10XWdZluE4juH5uSENfhVRUFR7628YhmNChVRjzKWU+x25IKmO8e2O5d+gxopuotj62KEUSPY2KYRU0wRrlmykIoeB5xXHdkSWFyw3cVqH9qcjaG9hr+6XiYtmDvtzV5BeyHI52aVQ8gC9wsVp8wQ6QkKdtamzQ7/3efrH/P6un4EHRjdAboi5AAAAAElFTkSuQmCC"
  },
  {
    name: "Sainsmart Genmitsu 3020 PRO Max v2",
    minCost: 500, maxCost: 500, avgCost: 500,
    minArea: 0.5, maxArea: 0.5,
    url: "https://www.sainsmart.com/collections/cnc-router/products/genmitsu-3020-pro-max-cnc-machine",
    features: "Rigid frame and deeper Z-axis than typical 3018 machines.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX///8zm8sll8kNkscalMjQ5PD2+vwtmcrw9vrg7fVustaPwt7r8/mTxN/Y6fPK4e4/n8262OqozuV/utoAjsVQpdB2ttibyOFeq9PB3OwAisOu0uaakzjnAAABOElEQVQ4ja1T2ZaFIAyjC9Z9R9H5//8cRC7K1XmbPPWcBGiTotT/Imu7rs3+YvO1J3agfs3f+IpQwEOQqgddCMINKEXKaxJIIKTvfE3wANU3Qf/kAfqLH/FNgGMUsLwJhD/8YMunRNiaIQjKTW2IiUQQNzWUQYDr0QdctwjD8f6KQUBnv7oy3mo21emBoZABczQlz+uYlWY+M8n4M/Ksa1aDRHM4iAlw8oVd1DwU+xnDhBCeUAaAGz/vrBarwNcNA5ggaJyRvBzVvuk9G4+Di+OxCYKCj9HE2TK2qsyzH9fHMTLHyI344aXRboa6W8VbIjZm0Z5pi3gbWE7HqL3irF7i5GTt7EOBViWw/HW+VF9Y6XYJ0vjNu72crjSn14/RxSuwe+Pvm51s9AflbaXk0aILPfkaFLfiFzpqCsc5b/5tAAAAAElFTkSuQmCC"
  },
  {
    name: "BobsCNC E4",
    minCost: 650, maxCost: 650, avgCost: 650,
    minArea: 3, maxArea: 3,
    url: "https://www.bobscnc.com/products/e4-cnc-router-engraver-kit",
    features: "Larger version of E3, offers bigger work area at an entry-level cost.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABKVBMVEVHcEzp5d6kmpSMdGCto5nNx8H39fLr6ebRzMjr6umtk3jEvrmSemaccEGhd0rHu66oknzPtpnt5t3DvLN7bWWWioWqiWaljXmHWCdLOjWBY0TNm1e4nHjYxKi3mnqliWq1oY2kjHPFpH6kgly8lmjCvbi1oIuopKJ/cWuoqKiDX0OacEaff1e3oIPSrHqbc0lrSTJZNx9lYWB8ZVidajFOOS+FdWNhU0etpKCSdlvLmjzcqFXZpFLcqljbplLTnk7GkUVyUjJ7WThnRSxzSivgrFfWoVLVo2LOmEm7h0GUbEOPZTymdTmGYDmygUiWZjFpPRzirmGIZUKvfTuwei+mbizNmFCwglLEdwrCkFK+iDxEKBlzRyWFThOxbAaaWBHOnmkOBgbghQC3RFvCAAAAO3RSTlMAKl7QCkoZAxMMlTy5/vxZWp07Z6KN2an96N/0cn/CvIDOx8zmJqV3uTPt3+9L4vDz/qzc8Ptv94He017tKn0AAAGlSURBVCiRhZLnctpQFISvJFQRvYPpHdxn7BT13oXouCd5/4eI7MQeEUiyf7+5e3d2DwD/FU78A6avMUAS+FFGXH+H+2j8+PP4aETn0NT48DuIAHClUkHxOBo7hFi2NKo+5cE4d+CLYwDKfP76ozssjPFYqGgsHIVhpLzblW+QwaBRLHZSEUi2vUdZXr+ok9KUKj7N3JMIjH1xVVV5CW4mdJWeBo/JPYjMgodg91xGmiWKql5N0vvwsqKsnqdxgsRBb3bRIiOBaK8K96ECCchsPeNbm1ovk/2oLi9LSgtFOj1/uVrdi6bY6Ojnmexb08NPnnRlO+v12l1aoinoQq2m6XPjvA6nADbsyg+q4/uWKJqmIOgsw/Lc3JgbXvu19tv8pZLY3m10XWdZluE4juH5uSENfhVRUFR7628YhmNChVRjzKWU+x25IKmO8e2O5d+gxopuotj62KEUSPY2KYRU0wRrlmykIoeB5xXHdkSWFyw3cVqH9qcjaG9hr+6XiYtmDvtzV5BeyHI52aVQ8gC9wsVp8wQ6QkKdtamzQ7/3efrH/P6un4EHRjdAboi5AAAAAElFTkSuQmCC"
  },
  {
    name: "Sainsmart Genmitsu PROverXL 4030",
    minCost: 700, maxCost: 700, avgCost: 700,
    minArea: 0.8, maxArea: 0.8,
    url: "https://www.sainsmart.com/collections/cnc-router/products/genmitsu-proverxl-4030-cnc-router",
    features: "Sturdier rails, reliable electronics, good for hobby sign-making.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX///8zm8sll8kNkscalMjQ5PD2+vwtmcrw9vrg7fVustaPwt7r8/mTxN/Y6fPK4e4/n8262OqozuV/utoAjsVQpdB2ttibyOFeq9PB3OwAisOu0uaakzjnAAABOElEQVQ4ja1T2ZaFIAyjC9Z9R9H5//8cRC7K1XmbPPWcBGiTotT/Imu7rs3+YvO1J3agfs3f+IpQwEOQqgddCMINKEXKaxJIIKTvfE3wANU3Qf/kAfqLH/FNgGMUsLwJhD/8YMunRNiaIQjKTW2IiUQQNzWUQYDr0QdctwjD8f6KQUBnv7oy3mo21emBoZABczQlz+uYlWY+M8n4M/Ksa1aDRHM4iAlw8oVd1DwU+xnDhBCeUAaAGz/vrBarwNcNA5ggaJyRvBzVvuk9G4+Di+OxCYKCj9HE2TK2qsyzH9fHMTLHyI344aXRboa6W8VbIjZm0Z5pi3gbWE7HqL3irF7i5GTt7EOBViWw/HW+VF9Y6XYJ0vjNu72crjSn14/RxSuwe+Pvm51s9AflbaXk0aILPfkaFLfiFzpqCsc5b/5tAAAAAElFTkSuQmCC"
  },
  {
    name: "FoxAlien 4040-XE",
    minCost: 750, maxCost: 750, avgCost: 750,
    minArea: 0.8, maxArea: 0.8,
    url: "https://www.foxalien.com/products/4040-xe-cnc-router",
    features: "More powerful stepper motors vs. Masuter line. Can handle light aluminum.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAMAAAAynjhNAAAAdVBMVEVHcEx5Sy7/gRL/lDT/hBbgaw7/hRb/hxX/kyldMRPMbAr/hRj/hxabVAuMRQ//hxn/hhcFAADrfQ//hRT/hRn/hxe0XAb/jxUAAAD/iBb/gxhXKACCPgQuCQBEIQBGHQAAAABVIwBXIwBaJABVKQBPIABVKQB8FMVtAAAAJ3RSTlMABTsHI+VQdxCu/57X/nLpuP3/Yor0////////////b8o+Vy0ZlK9wD4DVAAABXElEQVR4AYySB3aEIBBAGSBKxI2GIoxxCxhz/yNmTLGl/l3rn/qe7B/A75ZzdkBwuebyu0LsbXmn2McrXqj7SqtNNVmfHlTxUVI2TftoGitAzIByvnusvRXs04dTNL51WmvnXI1VrEJJdvEYT9h7+s2EpxhKtoH7zvQLWHVuv2tBeRvfCrZDNf2Wo6Zs3Ggvd1boHsOnpztv97VrHM4VvssuDqjFfnKM50geZ3s+h0ZtLDja9XyOBhFNfDoP6Pmudo+GkoaA4XI+nxGp+k5T2SFGE6oYB7L7zZWjxUJf9cF0JiA29rC41BQwQ9KXih0RsvXvUi9yCwheV51ppWA/oK63RPJHANg3CCFWD8cYKF3BpCAgZ8jjCM9A/6VlW3PeWqktmybIaUwvKU0JFq2Vs46jG6cpp5yvU0r5mpaPXrKitby0OSXSY7pCSmlcRptLADHfzCcxX4C9jlIAAMFqIQCgdZbRAAAAAElFTkSuQmCC"
  },
  {
    name: "Sainsmart Genmitsu PROverXL 6050",
    minCost: 1000, maxCost: 1000, avgCost: 1000,
    minArea: 1.25, maxArea: 1.25,
    url: "https://www.sainsmart.com/collections/cnc-router/products/genmitsu-proverxl-6050-cnc-router",
    features: "Larger workspace than 4030, improved rigidity for deeper cuts.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAVFBMVEX///8zm8sll8kNkscalMjQ5PD2+vwtmcrw9vrg7fVustaPwt7r8/mTxN/Y6fPK4e4/n8262OqozuV/utoAjsVQpdB2ttibyOFeq9PB3OwAisOu0uaakzjnAAABOElEQVQ4ja1T2ZaFIAyjC9Z9R9H5//8cRC7K1XmbPPWcBGiTotT/Imu7rs3+YvO1J3agfs3f+IpQwEOQqgddCMINKEXKaxJIIKTvfE3wANU3Qf/kAfqLH/FNgGMUsLwJhD/8YMunRNiaIQjKTW2IiUQQNzWUQYDr0QdctwjD8f6KQUBnv7oy3mo21emBoZABczQlz+uYlWY+M8n4M/Ksa1aDRHM4iAlw8oVd1DwU+xnDhBCeUAaAGz/vrBarwNcNA5ggaJyRvBzVvuk9G4+Di+OxCYKCj9HE2TK2qsyzH9fHMTLHyI344aXRboa6W8VbIjZm0Z5pi3gbWE7HqL3irF7i5GTt7EOBViWw/HW+VF9Y6XYJ0vjNu72crjSn14/RxSuwe+Pvm51s9AflbaXk0aILPfkaFLfiFzpqCsc5b/5tAAAAAElFTkSuQmCC"
  },
  {
    name: "Next Wave CNC SHARK SD100",
    minCost: 1000, maxCost: 1800, avgCost: 1400,
    minArea: 1, maxArea: 1,
    url: "https://www.nextwavecnc.com/shark-sd100",
    features: "Compact Shark model with stable gantry; good for small craft projects.",
    iconUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACAAIAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAABgcFBP/EACcQAAICAQMDBAIDAAAAAAAAAAECAwQFABEhBhITFCJBUVKRFTFC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgH/xAAbEQACAgMBAAAAAAAAAAAAAAAAAQIRITFBEv/aAAwDAQACEQMRAD8AuOjSfmsjkMj1BUxNGdqtA2jBYmjO0krLGZGVW/yANhuOdyfrnF6rr9UC1mkw9iwYbEvhrRJc7HhYUwVaPncBnLArxyqt9nTlBxSvoYz9N1wpWjU0mgy/oKcOKnyE0vmeS123ZEaWuVQtHH5JpD5GA3Rgw22fYrvuWTAxVq/UOUb+QnkM0i+limyUkoKFFZu2NnIHuDfHA3A40BHRawc0kUjVZFitw3jbqyNypJHKtt8EMyn96XeoMDlMtk5r6d2PmFdGgjKGVVuI3EvcgPtKbpyAdj/Q1QdGm52qYVGtEzr9FZOsRNib9eG6NijvSkVYmQ9kWx29wWFpI/jgj61pdN4k4vqN/QwAUHMfi7pWUxoldIgO3sIY+z8geeRxp60aOC5P/9k="
  },
  {
    name: "X-Carve (basic kit) 💀",
    minCost: 1100, maxCost: 1500, avgCost: 1300,
    minArea: 3, maxArea: 3,
    url: "https://www.inventables.com/products/x-carve-1",
    features: "Beloved by hobbyists; large community & easy software (Easel).",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAADsklEQVRIieWWf0zUZRzHX987figiQj8oyB+sGhVMsQxOzMqgPyJ0YAZRu4X/uLCWtTXLsizXklpbq8lUQBQQC4WdELCRrEsULob444hMhCLhThFRUzx+3d330x/cxibXcVhubr3//Hz3fr++z/P5PHseRUS4ldLc0vT/HWDwAgf1NGzAOey9SfGuyULz55g/wB9UUGHxHqL0/xGgsxJTKnaI30P7N4TEMe0eTn5McCjLqrk31rPb4xb1t1E+H2MqKiTUEqVHRvG7g8WbeKWLGQs4EEdtGoO9UweM/IXxNSrm4xNEagtOQAFQ/Oj5lt4WgiJYUUeykf5ySsJo3gKq14ATWykO4WweGkiuI3ThuFfRMvIHlbHUpjN0kbnPoBd02zFvpFBLR4UXAHM+LetY9DVJTdjBMYLqHP/qHCRyE8sb6S+jOJSjX4AQk8Xqa8xbi3El1qZJV6DgD4+9heLrdsk47dy3BL2gy+HkBoo0dH6P70yWbUWBCSPjocnupksbQEc2LV8CLHyDzKvMWUNdCobHOd+EBlervAO4haoELqD1XQoVfq/GL4iEPNJ/RVRqluLjxjFVwAizV5I5xJw1HFyBIZZLp7gzilXHeboMx78BaHwBHFewWdBOIzGPtDZUG2XRGLNw2Ih8we2gegFQNGjg3E98F4Kth64CDIu43M5d0bx4imcr6M5ldyDHvkJ7EwDf6VztQgNtnxKcSEYfq9rRBmF4mENvYh/gwRRWq8Rs4cT6KQIUH3ygYT37IwkIZ3kTSeVMv5uhS9gvooXuHIqCMOeCQtz7pHUyOiWA5RAKdOWwtJiXrITpGOih+jkqlxDwAOnneVWIyeZYFnsVLEeYFeE2ZuJkKShwQEdfM9HvEb8ZrT+qnabNtH7GrGBSTITHA1hN/FkEMDOBmqcIT8Td0ZwAUEexw3AH+nPMCAM4XYrpZQSeLCQ6E+C6lfq1dFcxN5mkOgJn09vMDzpUkAmjKjdo+IrUZkg+UpUkZ3+U/Q/JDuTwO+IYEhFR7dL4kWxH9vqKpcFlsZqkdJ7kI40bRXXckDcBMKbeFtl3v+Qhu5ELR13F0/ukANmJ/FLgqgxYpSZFtiHVz8u1brdJ/wAY02+lUojsQsy5Uv6o5CL1b4vdJiKiOuTnT2QHUoL0HPaQ4REgIs5RafxQcscw21zF9jLZheQjrTsnsYt4d+lft1D/OpYqIjKwnaHvOI+s44lsfAIm9076C+PqOSIliEEnl894b/Ly2XLzuq1edrcn4G9YJ70Qf0rSkgAAAABJRU5ErkJggg=="
  },
  {
    name: "Shapeoko 4",
    minCost: 1500, maxCost: 1500, avgCost: 1500,
    minArea: 3, maxArea: 3,
    url: "https://shop.carbide3d.com/collections/machines/products/shapeoko-4",
    features: "Upgraded belts, simpler assembly than older Shapeoko versions.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAJ1BMVEVHcEyAxHN/w3F/xHJ/xHJ/w3J/w3J9w29+w3B/xHF+w3F9w3GAxHNHP+KXAAAADHRSTlMA9k16yuSvFimPYToG9FdtAAAAxUlEQVQokb2S2xLDIAhEo3IR5f+/txWw1lxm+tR9SnICDOwex6+qQp0fUEHVJP0GcQM1odQza5R0Csre0RG2bOUJ8mJj2FvCo7s9J4reFbbXQ/xXL86jpTdiXkPKB5KhTNQGZtzgqOuSRvdcG+kZdow9wZfaYNNd/4A9Dg8EV+iW4dsy2+n7CHaaLuEmbFChuav2AValH14hIsBh33TNbdLhC0vEYWWJ3aYkJzdDnXAumGL+XYqg3KXT8oflkr2JyzWWj3oBwAkOU/y4JcQAAAAASUVORK5CYII="
  },
  {
    name: "BobsCNC KL744",
    minCost: 1900, maxCost: 1900, avgCost: 1900,
    minArea: 2.5, maxArea: 2.5,
    url: "https://www.bobscnc.com/products/kl744",
    features: "Large working area in a wooden frame design. Good for wood signs.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABKVBMVEVHcEzp5d6kmpSMdGCto5nNx8H39fLr6ebRzMjr6umtk3jEvrmSemaccEGhd0rHu66oknzPtpnt5t3DvLN7bWWWioWqiWaljXmHWCdLOjWBY0TNm1e4nHjYxKi3mnqliWq1oY2kjHPFpH6kgly8lmjCvbi1oIuopKJ/cWuoqKiDX0OacEaff1e3oIPSrHqbc0lrSTJZNx9lYWB8ZVidajFOOS+FdWNhU0etpKCSdlvLmjzcqFXZpFLcqljbplLTnk7GkUVyUjJ7WThnRSxzSivgrFfWoVLVo2LOmEm7h0GUbEOPZTymdTmGYDmygUiWZjFpPRzirmGIZUKvfTuwei+mbizNmFCwglLEdwrCkFK+iDxEKBlzRyWFThOxbAaaWBHOnmkOBgbghQC3RFvCAAAAO3RSTlMAKl7QCkoZAxMMlTy5/vxZWp07Z6KN2an96N/0cn/CvIDOx8zmJqV3uTPt3+9L4vDz/qzc8Ptv94He017tKn0AAAGlSURBVCiRhZLnctpQFISvJFQRvYPpHdxn7BT13oXouCd5/4eI7MQeEUiyf7+5e3d2DwD/FU78A6avMUAS+FFGXH+H+2j8+PP4aETn0NT48DuIAHClUkHxOBo7hFi2NKo+5cE4d+CLYwDKfP76ozssjPFYqGgsHIVhpLzblW+QwaBRLHZSEUi2vUdZXr+ok9KUKj7N3JMIjH1xVVV5CW4mdJWeBo/JPYjMgodg91xGmiWKql5N0vvwsqKsnqdxgsRBb3bRIiOBaK8K96ECCchsPeNbm1ovk/2oLi9LSgtFOj1/uVrdi6bY6Ojnmexb08NPnnRlO+v12l1aoinoQq2m6XPjvA6nADbsyg+q4/uWKJqmIOgsw/Lc3JgbXvu19tv8pZLY3m10XWdZluE4juH5uSENfhVRUFR7628YhmNChVRjzKWU+x25IKmO8e2O5d+gxopuotj62KEUSPY2KYRU0wRrlmykIoeB5xXHdkSWFyw3cVqH9qcjaG9hr+6XiYtmDvtzV5BeyHI52aVQ8gC9wsVp8wQ6QkKdtamzQ7/3efrH/P6un4EHRjdAboi5AAAAAElFTkSuQmCC"
  },
  {
    name: "Shapeoko Pro",
    minCost: 2000, maxCost: 2000, avgCost: 2000,
    minArea: 4, maxArea: 4,
    url: "https://shop.carbide3d.com/collections/machines/products/shapeoko-pro",
    features: "Heavier linear rails, more rigid, better for aluminum than Shapeoko 4.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAJ1BMVEVHcEyAxHN/w3F/xHJ/xHJ/w3J/w3J9w29+w3B/xHF+w3F9w3GAxHNHP+KXAAAADHRSTlMA9k16yuSvFimPYToG9FdtAAAAxUlEQVQokb2S2xLDIAhEo3IR5f+/txWw1lxm+tR9SnICDOwex6+qQp0fUEHVJP0GcQM1odQza5R0Csre0RG2bOUJ8mJj2FvCo7s9J4reFbbXQ/xXL86jpTdiXkPKB5KhTNQGZtzgqOuSRvdcG+kZdow9wZfaYNNd/4A9Dg8EV+iW4dsy2+n7CHaaLuEmbFChuav2AValH14hIsBh33TNbdLhC0vEYWWJ3aYkJzdDnXAumGL+XYqg3KXT8oflkr2JyzWWj3oBwAkOU/y4JcQAAAAASUVORK5CYII="
  },
  {
    name: "Onefinity Woodworker X-35",
    minCost: 2000, maxCost: 2500, avgCost: 2250,
    minArea: 4.5, maxArea: 4.5,
    url: "https://www.onefinitycnc.com/product-page/woodworker-x-35",
    features: "Ball-screw motion, easy assembly, strong steel tubes for rigidity.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAG1BMVEVHcEys0Kyt0K2s0Kyt0K2s0Kyt0K2s0Kyt0a24fpQtAAAACHRSTlMAYVSmsHs4InV3ARMAAABfSURBVCiRvdFBDoAwCETRglW5/4lNDEVSfl12tm8zyW/tnZpPW10g6WV/Khu0w+XQAzB0QjmzTqgmSQtmrZgU8FPCUMShHdH1ZnRdIGmKDaoblGKHYmxl9Ni6iJ114AM/wwebvgk2rwAAAABJRU5ErkJggg=="
  },
  {
    name: "Sienci LongMill (48×30)",
    minCost: 2000, maxCost: 2500, avgCost: 2250,
    minArea: 10, maxArea: 10,
    url: "https://sienci.com/product/longmill-48x30/",
    features: "Larger version for bigger panels, same sturdy design as 30×30.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAeFBMVEVHcExgYGAAAABISEhsbGwAAACKiooAAAAAAAAAAAAQEBBoaGgAAAAAAAAuLi59fX3///+hoaHx8fGVlZVqamqOjo6Dg4N3d3f4+Pj9/f26urro6Ojg4ODZ2dnHx8eqqqqcnJzOzs6mpqZaWlqvr6+srKwsLCw/Pz+GFRXNAAAAEHRSTlMA7RXe8IPrWiw7l8RPbsLe3Ks+swAAAS5JREFUKJF1k+l2hCAMhZm6O9Np2BVcZ2nf/w1LwAXt6f2BRz9uSEIkZFVVX3PO82tWkrM+UwleoxzS4oDKi20ookF0bu2Tj50VTwDmoBUm2EFWGzO96JoHSI7f2xZXutASA1ItFHMkYPeQIfLFB2LfLzgoQZYxv5WNVsywePHRY84qvGFCRrPImhJy63boTpI7HEpSQwyBabPRjHwdIbSzCLEadSd8ST1An85DN642BTkZT06/RU7a2bmHuzN4mXrqGeH018klTGAEy5f+RNAI67gLwO+kViaGVgze3PpSbnYW/QpbtZyC0DUB24e5I3xt7UOYhsa7gmkzdj7CBrtiuzIrft6+jHaFSXTZ6g2R+HrZy5jQGFJanQdsl95YNJpBh9GMh9rVdxrqf36HX2zZLDfUedcoAAAAAElFTkSuQmCC"
  },
  {
    name: "Inventables X-Carve Pro",
    minCost: 6000, maxCost: 6000, avgCost: 6000,
    minArea: 16, maxArea: 16,
    url: "https://www.inventables.com/products/x-carve-pro-4x4-cnc-machine",
    features: "Upgraded rails & motion system, designed for light business use.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAADsklEQVRIieWWf0zUZRzHX987figiQj8oyB+sGhVMsQxOzMqgPyJ0YAZRu4X/uLCWtTXLsizXklpbq8lUQBQQC4WdELCRrEsULob444hMhCLhThFRUzx+3d330x/cxibXcVhubr3//Hz3fr++z/P5PHseRUS4ldLc0vT/HWDwAgf1NGzAOey9SfGuyULz55g/wB9UUGHxHqL0/xGgsxJTKnaI30P7N4TEMe0eTn5McCjLqrk31rPb4xb1t1E+H2MqKiTUEqVHRvG7g8WbeKWLGQs4EEdtGoO9UweM/IXxNSrm4xNEagtOQAFQ/Oj5lt4WgiJYUUeykf5ySsJo3gKq14ATWykO4WweGkiuI3ThuFfRMvIHlbHUpjN0kbnPoBd02zFvpFBLR4UXAHM+LetY9DVJTdjBMYLqHP/qHCRyE8sb6S+jOJSjX4AQk8Xqa8xbi3El1qZJV6DgD4+9heLrdsk47dy3BL2gy+HkBoo0dH6P70yWbUWBCSPjocnupksbQEc2LV8CLHyDzKvMWUNdCobHOd+EBlervAO4haoELqD1XQoVfq/GL4iEPNJ/RVRqluLjxjFVwAizV5I5xJw1HFyBIZZLp7gzilXHeboMx78BaHwBHFewWdBOIzGPtDZUG2XRGLNw2Ih8we2gegFQNGjg3E98F4Kth64CDIu43M5d0bx4imcr6M5ldyDHvkJ7EwDf6VztQgNtnxKcSEYfq9rRBmF4mENvYh/gwRRWq8Rs4cT6KQIUH3ygYT37IwkIZ3kTSeVMv5uhS9gvooXuHIqCMOeCQtz7pHUyOiWA5RAKdOWwtJiXrITpGOih+jkqlxDwAOnneVWIyeZYFnsVLEeYFeE2ZuJkKShwQEdfM9HvEb8ZrT+qnabNtH7GrGBSTITHA1hN/FkEMDOBmqcIT8Td0ZwAUEexw3AH+nPMCAM4XYrpZQSeLCQ6E+C6lfq1dFcxN5mkOgJn09vMDzpUkAmjKjdo+IrUZkg+UpUkZ3+U/Q/JDuTwO+IYEhFR7dL4kWxH9vqKpcFlsZqkdJ7kI40bRXXckDcBMKbeFtl3v+Qhu5ELR13F0/ukANmJ/FLgqgxYpSZFtiHVz8u1brdJ/wAY02+lUojsQsy5Uv6o5CL1b4vdJiKiOuTnT2QHUoL0HPaQ4REgIs5RafxQcscw21zF9jLZheQjrTsnsYt4d+lft1D/OpYqIjKwnaHvOI+s44lsfAIm9076C+PqOSIliEEnl894b/Ly2XLzuq1edrcn4G9YJ70Qf0rSkgAAAABJRU5ErkJggg=="
  },
  {
    name: "Carvera (desktop ATC)",
    minCost: 3000, maxCost: 3500, avgCost: 3250,
    minArea: 1.3, maxArea: 1.3,
    url: "https://www.makera.com/pages/carvera",
    features: "Compact enclosed CNC with automatic tool changer; high precision.",
    iconUrl: "data:image/png;base64,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"
  },
  {
    name: "Avid CNC Benchtop Pro",
    minCost: 3500, maxCost: 5000, avgCost: 4250,
    minArea: 4, maxArea: 4,
    url: "https://www.avidcnc.com/benchtop-cnc.html",
    features: "Modular kit, heavy-duty linear bearings, can handle aluminum or wood.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEWrIyirIieqHySqGyGpDhWpDxetHyatICW5TlLWmJvu0tT68fH26erTkZO3RkquKzDNg4b04eL////x2tvIeHytJivKfX/CbG/25+f79fXCZmmoFRy8Wl21PUGvMTboyMngs7X++/vao6Xeq62pOZ04AAAA4klEQVR4Ac2QVRaEMAwAqeLu1JD733GTrts/g2ceseDUEErIH8O4kCEX7IenJIqTNEvygn5ZWlZ142m7/sMSUqXNjWz4+FeME4Tntp7hUS/q1akCc0651nGGmQ17OmYdhNKqZ6rPMb0rH5bKFQLbXjLBebhv8HEwenM9fm9Hz8q4bdsa5bb39OqumQxTVXPlWoPgEB022kYqUHnzpB5hlVS3OJtW8Bq56QoOlGhIvPskwu+9GK/kaHfIe0D5GMujZR7Vxxt0HEDaJIst/di03VOflimpPhxYRRi7JiOf7ho8HxdJFRLqbmTHRAAAAABJRU5ErkJggg=="
  },
  {
    name: "Next Wave CNC SHARK HD520",
    minCost: 4500, maxCost: 5500, avgCost: 5000,
    minArea: 2.8, maxArea: 2.8,
    url: "https://www.nextwavecnc.com/shark-hd520",
    features: "High-end Shark series router with rigid frame & larger Z clearance.",
    iconUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACAAIAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAABgcFBP/EACcQAAICAQMDBAIDAAAAAAAAAAECAwQFABEhBhITFCJBUVKRFTFC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgH/xAAbEQACAgMBAAAAAAAAAAAAAAAAAQIRITFBEv/aAAwDAQACEQMRAD8AuOjSfmsjkMj1BUxNGdqtA2jBYmjO0krLGZGVW/yANhuOdyfrnF6rr9UC1mkw9iwYbEvhrRJc7HhYUwVaPncBnLArxyqt9nTlBxSvoYz9N1wpWjU0mgy/oKcOKnyE0vmeS123ZEaWuVQtHH5JpD5GA3Rgw22fYrvuWTAxVq/UOUb+QnkM0i+limyUkoKFFZu2NnIHuDfHA3A40BHRawc0kUjVZFitw3jbqyNypJHKtt8EMyn96XeoMDlMtk5r6d2PmFdGgjKGVVuI3EvcgPtKbpyAdj/Q1QdGm52qYVGtEzr9FZOsRNib9eG6NijvSkVYmQ9kWx29wWFpI/jgj61pdN4k4vqN/QwAUHMfi7pWUxoldIgO3sIY+z8geeRxp60aOC5P/9k="
  },
  {
    name: "Laguna IQ",
    minCost: 6000, maxCost: 8000, avgCost: 7000,
    minArea: 2.7, maxArea: 2.7,
    url: "https://lagunatools.com/cnc/iq-cnc/",
    features: "Industrial-quality build, welded steel frame, brand reputation.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADO0lEQVRYhbVXvU8UQRT/vZkNh3fGAo2JsWM2EY3YEq6ztsXEyj8B7YTYg612VCZWUtnbSGnsIHTuFVTkxFDIacLdsc9id3bezM59Ib5k73bf52/evJk3QwjImPQ3gCaoZDCXL1TpEAk22Mmo/AzJiQ+zLFuWIhUEPwHQjLioPJN1Ro4XjxrF8NCk6dcoAGPSbwBuxUyJigcoRs7MZQYopu6eAH4Jc8Wk6SfL10Vw8x6gJzHIgBu1c4UCEMmIdbtKFCaIsHRzYeHG6enpZzLGrAN4W4Nc1UA4RAeAo3LUE1MHUOBiPCNjDEetRhZhUXQ2K14tzg4AScxiOBzivH8ujJ2HVqsFoKgBIvKcUzjv7PNZ1Kx9TeSoAGAwGKDdbmO1vQrO89KoUNc6wfb2NppNt1D8JRkPPI5qU9A762Hj9QZerr+IGxBhcdFUq0KEhZ9JLgE4XggUqDJgvQNMDM4nr+sCjO/YZsP+hwElZivzAfwTURBkivwj2AlnChcZpX2PpXoU+avAblf55OAirJR4UxDqx4ozCZuMxDMd2a2OUNsFx9SAJTEFhbaaclL8NPsZZLHxjyILRsU2j2nWr4wbY03rQox3pryPBkmlLLLkYktTyW+rkE8owjDgKOxE9QIM5cqfqykmT4C18ScBCYNKSmR3Yy68TCrEXu8PlKKqqcg+GbPN8yLw/Pw8VKlggcy8E25tvUGjMTdeKViRzIDWGru7H9HtdisQlwKwuflqVpOK9va+4Pj42AMQSRh5CldJHKlEBfgn3VbrGnZ2dtDv9/8LiCgAFo/SGr/OzrC29hQnJz+vNBgp5cUCIiciAGg0Gtg/2Mftu3fw6P4DGGPK9JHXaEZtRvYQJc8jpDWy7xm00v5dxhjDzpN/AGVm5BeMPL9wowiPYP4haCwlSQJS5JklAD4AeB4zICJoTdBaCd7lAUToHQGAMeYAwLIvi3mmOgCrOk1w//6yl2XZ44plUnMOxpyVktjf7DUsnCkW3iSjpifvrgWv0+lkKeDtA8Prrnv4J4vibug4Xscg0QbCoiQnr/AQfmCIJatSAehkRwMA9+SFiFksUdlKR3W/8ifWdkvqAljpHGVDy/gLEa4r7rzEn/UAAAAASUVORK5CYII="
  },
  {
    name: "Camaster Stinger I",
    minCost: 6000, maxCost: 9000, avgCost: 7500,
    minArea: 2.6, maxArea: 2.6,
    url: "https://www.camaster.com/product/stinger-i-cnc-router/",
    features: "Entry-level pro machine with solid gantry, vacuum table options.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAKlBMVEVHcEz+yFb+yFX+yFb+yFb+x1X+yFb+yFb+yFb+yFb9x1T+yFb+yFb+yFbnZRWPAAAADXRSTlMAlDCA92HlSL2gDNMXlVuzLgAAAIVJREFUKJGtklESgCAIBU1BM/X+162MDJX4aNpPd2AeoDE/sAV0y00MXKEvHY5VDYrLPCoupzomXXta452oBSIDXUIikNykAePlUJw+XVJeDVTnZUlBP8skS68FolGsKFHtSxuKWt/iUdogvxVU2D1DmWDfBDVpLCjyKF7hXZ5k28jy1A87sFQNYvYlpv8AAAAASUVORK5CYII="
  },
  {
    name: "Tormach PCNC 440",
    minCost: 7000, maxCost: 7000, avgCost: 7000,
    minArea: 1, maxArea: 1,
    url: "https://tormach.com/machines/mills/440/",
    features: "Small CNC mill for metals (steel/aluminum) with enclosure options.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEwjN0QlN0QoNkIlNkMlN0IpOEYlN0UnNkYNIzIhMj5JV2NZZXA4R1OIkJn///+hrbSPl6KxuLvJzM7w+PojNkdgX741AAAAFnRSTlMARWkYff///97///////////////+qL0ohEwAAAQNJREFUeAG90wWWg1AQRFEkVRUat/1vddLwm7gcmxtPv4OTJXlxLy+zWyeAoBhE8VxkocRG98hzzPkmiOJ8zO8iRlHACYeYuzwWoMoeyUw8py2s6uZZW9dimeU+7/oXBl9Evm0Ch243HrqpHyvIii1op93ccIhi7kcj7OSB1bFQ9FceEJdAAttddfm7qYykzPwDKbCk7fuuWYbKTCKIWIKw86Ce+6ECtsD9GOgh0NVdgLeB+7gE999LuF6ARZbfB+1DkGclFDyYl0uACCi/5JgSX4KbUhBXfiEoYe0IEIg1+CKgYGZI5NbMlY/3C7WBr+C+oIAjgNLcrWRKeARx8367/f8AVHceEJDcp3EAAAAASUVORK5CYII="
  },
  {
    name: "Avid CNC PRO 4848",
    minCost: 7000, maxCost: 7000, avgCost: 7000,
    minArea: 16, maxArea: 16,
    url: "https://www.avidcnc.com/pro4848-cnc-router.html",
    features: "4×4 foot kit, rack & pinion drives, popular for small businesses.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEWrIyirIieqHySqGyGpDhWpDxetHyatICW5TlLWmJvu0tT68fH26erTkZO3RkquKzDNg4b04eL////x2tvIeHytJivKfX/CbG/25+f79fXCZmmoFRy8Wl21PUGvMTboyMngs7X++/vao6Xeq62pOZ04AAAA4klEQVR4Ac2QVRaEMAwAqeLu1JD733GTrts/g2ceseDUEErIH8O4kCEX7IenJIqTNEvygn5ZWlZ142m7/sMSUqXNjWz4+FeME4Tntp7hUS/q1akCc0651nGGmQ17OmYdhNKqZ6rPMb0rH5bKFQLbXjLBebhv8HEwenM9fm9Hz8q4bdsa5bb39OqumQxTVXPlWoPgEB022kYqUHnzpB5hlVS3OJtW8Bq56QoOlGhIvPskwu+9GK/kaHfIe0D5GMujZR7Vxxt0HEDaJIst/di03VOflimpPhxYRRi7JiOf7ho8HxdJFRLqbmTHRAAAAABJRU5ErkJggg=="
  },
  {
    name: "ShopBot Desktop",
    minCost: 8000, maxCost: 10000, avgCost: 9000,
    minArea: 2.7, maxArea: 2.7,
    url: "https://www.shopbottools.com/products/desktop",
    features: "Premium small-format CNC with robust rails & brand support.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAyUlEQVR4AWJwL/ChKx4cFo5aaGicZg7EDYB269iGQhCKwvAMbMAWrsEYjEHvDq7CFO7AClT3UZyCnJCbnKgWLxZ/p35CLtHRThUqXwKBnSMTizIIrKoY6jKIbTTqdDIqqWBePcCLrs8qWOgBQbwnqGBabGfCVkfnvsBTqqAdmFfDcB1YYWRQHxy9cuUcBqygi+jmgPILxFHCJBdsZyOw6qAYoe0N8Lgb/MC+BDFh7eaMqjNoL7TNYH8Um7788+HdH6iMwvfX9l/gD7DqtLEe65aQAAAAAElFTkSuQmCC"
  },
  {
    name: "ShopSabre RC Series (entry)",
    minCost: 10000, maxCost: 10000, avgCost: 10000,
    minArea: 16, maxArea: 16,
    url: "https://www.shopsabre.com/cnc-routers/rc-series",
    features: "Industrial router design, welded steel frame, high precision ball screws.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAz0lEQVR4AWMYXODj958C4jWLfwlXLfwnVLnwPyEs17DsNVzz55+/eUGCpGDVlhUv4QYUrT8+A12B98wdB/G5+MG7z0pwDjZnJyw9sPr+209KyPjF528SWE0j1flvvnwXhWued+JGJqkGTDtyrRBugN/snftJNeDn7z/scAOuvXivQ6oBRKeNqEX7NqJrDp63eydcwaLTt1LefP0h8vnHL15sWL5h2Ud0A84+em0GN0CmbulXipwvWbvku1j14l/4MCh5S9Qs/uk5Y/sRhkEHADg8SdpO5UtoAAAAAElFTkSuQmCC"
  },
  {
    name: "Tormach 770M",
    minCost: 10000, maxCost: 20000, avgCost: 15000,
    minArea: 1, maxArea: 1,
    url: "https://tormach.com/machines/mills/770m/",
    features: "Bigger, more powerful mill than 440, suitable for production shops.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEVHcEwjN0QlN0QoNkIlNkMlN0IpOEYlN0UnNkYNIzIhMj5JV2NZZXA4R1OIkJn///+hrbSPl6KxuLvJzM7w+PojNkdgX741AAAAFnRSTlMARWkYff///97///////////////+qL0ohEwAAAQNJREFUeAG90wWWg1AQRFEkVRUat/1vddLwm7gcmxtPv4OTJXlxLy+zWyeAoBhE8VxkocRG98hzzPkmiOJ8zO8iRlHACYeYuzwWoMoeyUw8py2s6uZZW9dimeU+7/oXBl9Evm0Ch243HrqpHyvIii1op93ccIhi7kcj7OSB1bFQ9FceEJdAAttddfm7qYykzPwDKbCk7fuuWYbKTCKIWIKw86Ce+6ECtsD9GOgh0NVdgLeB+7gE999LuF6ARZbfB+1DkGclFDyYl0uACCi/5JgSX4KbUhBXfiEoYe0IEIg1+CKgYGZI5NbMlY/3C7WBr+C+oIAjgNLcrWRKeARx8367/f8AVHceEJDcp3EAAAAASUVORK5CYII="
  },
  {
    name: "Avid CNC PRO 4896",
    minCost: 10000, maxCost: 15000, avgCost: 12500,
    minArea: 32, maxArea: 32,
    url: "https://www.avidcnc.com/pro4896-4-x-8-cnc-router-machine-p-1337.html",
    features: "Large 4×8 foot system, easily handles full sheet goods at scale.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEWrIyirIieqHySqGyGpDhWpDxetHyatICW5TlLWmJvu0tT68fH26erTkZO3RkquKzDNg4b04eL////x2tvIeHytJivKfX/CbG/25+f79fXCZmmoFRy8Wl21PUGvMTboyMngs7X++/vao6Xeq62pOZ04AAAA4klEQVR4Ac2QVRaEMAwAqeLu1JD733GTrts/g2ceseDUEErIH8O4kCEX7IenJIqTNEvygn5ZWlZ142m7/sMSUqXNjWz4+FeME4Tntp7hUS/q1akCc0651nGGmQ17OmYdhNKqZ6rPMb0rH5bKFQLbXjLBebhv8HEwenM9fm9Hz8q4bdsa5bb39OqumQxTVXPlWoPgEB022kYqUHnzpB5hlVS3OJtW8Bq56QoOlGhIvPskwu+9GK/kaHfIe0D5GMujZR7Vxxt0HEDaJIst/di03VOflimpPhxYRRi7JiOf7ho8HxdJFRLqbmTHRAAAAABJRU5ErkJggg=="
  },
  {
    name: "ShopBot Buddy 24",
    minCost: 12000, maxCost: 12000, avgCost: 12000,
    minArea: 8, maxArea: 8,
    url: "https://www.shopbottools.com/products/buddy",
    features: "Compact but powerful system with industrial components & brand support.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAyUlEQVR4AWJwL/ChKx4cFo5aaGicZg7EDYB269iGQhCKwvAMbMAWrsEYjEHvDq7CFO7AClT3UZyCnJCbnKgWLxZ/p35CLtHRThUqXwKBnSMTizIIrKoY6jKIbTTqdDIqqWBePcCLrs8qWOgBQbwnqGBabGfCVkfnvsBTqqAdmFfDcB1YYWRQHxy9cuUcBqygi+jmgPILxFHCJBdsZyOw6qAYoe0N8Lgb/MC+BDFh7eaMqjNoL7TNYH8Um7788+HdH6iMwvfX9l/gD7DqtLEe65aQAAAAAElFTkSuQmCC"
  },
  {
    name: "Laguna Swift 4×4",
    minCost: 15000, maxCost: 15000, avgCost: 15000,
    minArea: 16, maxArea: 16,
    url: "https://lagunatools.com/cnc/swift-series/",
    features: "Mid-range industrial router, rigid structure, vacuum hold-down options.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADO0lEQVRYhbVXvU8UQRT/vZkNh3fGAo2JsWM2EY3YEq6ztsXEyj8B7YTYg612VCZWUtnbSGnsIHTuFVTkxFDIacLdsc9id3bezM59Ib5k73bf52/evJk3QwjImPQ3gCaoZDCXL1TpEAk22Mmo/AzJiQ+zLFuWIhUEPwHQjLioPJN1Ro4XjxrF8NCk6dcoAGPSbwBuxUyJigcoRs7MZQYopu6eAH4Jc8Wk6SfL10Vw8x6gJzHIgBu1c4UCEMmIdbtKFCaIsHRzYeHG6enpZzLGrAN4W4Nc1UA4RAeAo3LUE1MHUOBiPCNjDEetRhZhUXQ2K14tzg4AScxiOBzivH8ujJ2HVqsFoKgBIvKcUzjv7PNZ1Kx9TeSoAGAwGKDdbmO1vQrO89KoUNc6wfb2NppNt1D8JRkPPI5qU9A762Hj9QZerr+IGxBhcdFUq0KEhZ9JLgE4XggUqDJgvQNMDM4nr+sCjO/YZsP+hwElZivzAfwTURBkivwj2AlnChcZpX2PpXoU+avAblf55OAirJR4UxDqx4ozCZuMxDMd2a2OUNsFx9SAJTEFhbaaclL8NPsZZLHxjyILRsU2j2nWr4wbY03rQox3pryPBkmlLLLkYktTyW+rkE8owjDgKOxE9QIM5cqfqykmT4C18ScBCYNKSmR3Yy68TCrEXu8PlKKqqcg+GbPN8yLw/Pw8VKlggcy8E25tvUGjMTdeKViRzIDWGru7H9HtdisQlwKwuflqVpOK9va+4Pj42AMQSRh5CldJHKlEBfgn3VbrGnZ2dtDv9/8LiCgAFo/SGr/OzrC29hQnJz+vNBgp5cUCIiciAGg0Gtg/2Mftu3fw6P4DGGPK9JHXaEZtRvYQJc8jpDWy7xm00v5dxhjDzpN/AGVm5BeMPL9wowiPYP4haCwlSQJS5JklAD4AeB4zICJoTdBaCd7lAUToHQGAMeYAwLIvi3mmOgCrOk1w//6yl2XZ44plUnMOxpyVktjf7DUsnCkW3iSjpifvrgWv0+lkKeDtA8Prrnv4J4vibug4Xscg0QbCoiQnr/AQfmCIJatSAehkRwMA9+SFiFksUdlKR3W/8ifWdkvqAljpHGVDy/gLEa4r7rzEn/UAAAAASUVORK5CYII="
  },
  {
    name: "Phantom CNC (smallest)",
    minCost: 15000, maxCost: 15000, avgCost: 15000,
    minArea: 16, maxArea: 16,
    url: "https://phantomcnc.com/cnc-routers/",
    features: "Heavy-duty frames, ball screw or rack/pinion options, pro-level support.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAtFBMVEX////Z2dnx8fHHx8a3t7fQ0NDT09P4+PhiZIapqamfn53Dw8OxsbG+vr6ampqurq5oaYjo6OufoLfT1NqWlpaEhqOio7Z7e6HLy8iVlqtFR7HIyNIAAJ8AAKesrMOsrLtnZ6R7fKhRUq5SU6fk5Orr6+i2tsG7vM3t7fl9fpRkZXnf3+/Q0OKcnKuUlZ+Li5uIiIt0dHOsrLSGh55wcYjFxtbHyOLY2OaWl8C5udqDg5RXWHFO2dv2AAABFUlEQVR4AWKgBwDULRdIDsNAAARXbJDMGGZmhv+/6xg2KWdsYZcIfSWMEM4FkeoZlGU7rqtd4/m+4wThA0axTIyvBbeFo4WbYsvygv2ip2WRl1hrdYyiAbhmq0DYbihkYbODkHSbdYS09/iyPwBUSzGEwwhwbZnY/Bcdd/SAY3c8mepPlLP5grewhUumYDD9QH+1ANCjOlbDKMB8Kvn6w8CXFNmIrXgMEAotP2a9YkuEdWdUBBthiKvD7ZTtzAhQkXGT8f4A4TrKbMPSIUYVHTPjSyBEOtkxm8Bzxl/HbC88qEoTeWwT4laZyqzDtFwGQViBp3Prs8vlChXR+jGujwdDqGp6WO1Wt+W9EgfnxfF4Hpzhr3f3qhlIFwDbLgAAAABJRU5ErkJggg=="
  },
  {
    name: "CAMaster Stinger II",
    minCost: 15000, maxCost: 20000, avgCost: 17500,
    minArea: 16, maxArea: 16,
    url: "https://www.camaster.com/product/stinger-ii-cnc-router/",
    features: "Scaled-up Stinger with bigger table & power. Ideal for cabinet shops.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAKlBMVEVHcEz+yFb+yFX+yFb+yFb+x1X+yFb+yFb+yFb+yFb9x1T+yFb+yFb+yFbnZRWPAAAADXRSTlMAlDCA92HlSL2gDNMXlVuzLgAAAIVJREFUKJGtklESgCAIBU1BM/X+162MDJX4aNpPd2AeoDE/sAV0y00MXKEvHY5VDYrLPCoupzomXXta452oBSIDXUIikNykAePlUJw+XVJeDVTnZUlBP8skS68FolGsKFHtSxuKWt/iUdogvxVU2D1DmWDfBDVpLCjyKF7hXZ5k28jy1A87sFQNYvYlpv8AAAAASUVORK5CYII="
  },
  {
    name: "ShopBot PRSalpha 4×4",
    minCost: 20000, maxCost: 20000, avgCost: 20000,
    minArea: 16, maxArea: 16,
    url: "https://www.shopbottools.com/products/prsalpha",
    features: "High-speed industrial-grade router for pro shops, advanced software.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAyUlEQVR4AWJwL/ChKx4cFo5aaGicZg7EDYB269iGQhCKwvAMbMAWrsEYjEHvDq7CFO7AClT3UZyCnJCbnKgWLxZ/p35CLtHRThUqXwKBnSMTizIIrKoY6jKIbTTqdDIqqWBePcCLrs8qWOgBQbwnqGBabGfCVkfnvsBTqqAdmFfDcB1YYWRQHxy9cuUcBqygi+jmgPILxFHCJBdsZyOw6qAYoe0N8Lgb/MC+BDFh7eaMqjNoL7TNYH8Um7788+HdH6iMwvfX9l/gD7DqtLEe65aQAAAAAElFTkSuQmCC"
  },
  {
    name: "Blue Elephant 1212",
    minCost: 15000, maxCost: 25000, avgCost: 20000,
    minArea: 16, maxArea: 16,
    url: "https://www.elephant-cnc.com/1212-cnc-router",
    features: "Chinese manufacturer with heavy frames, includes ATC & vacuum table options.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC7UlEQVR4Ae3XA3AkQQBG4bNt27Zt27Zt27Zt27Zt27Z2KnOvj32zPThtKVv1xcn/atFT8WG8ed98H/sk+EJuNELDb+r6Ou6KGGPW6SzRZ59pjIYGjaLNOVsxS881cQu0nlcHDb9phHzwBUfjQj7chS5xEVCcgFGM6SoE7MvRZXlJht5Bl9xHQfiAbUAynIZuREDdGDNPd7MIWJe3/aKajGjQDc4iOSzHI2IDdGXACVdn7oF6FgGTGGgC3cRmRIJyPAgmq4ale2AUAaUYc5kEjCnYam4/MWZhKoLil3Hf6IhPNgFjCMjG2DuTgP4EjLEJcKELfONHQCW8gG4TsDTqvPO5GXsLXaExAePEkI2XqPw9IB9uQLd13LUj4pIr6Rh6qBjXYs04WZWAVWLEgZsoIAK2QHfoXKj1d0XAVUXAu7iTjxYhYKcYcGibCMiEvQ4DbgTd/jQZYwcVAW8Sj91XgYDzDsf3I7MIEGJiFbxsAu4E2Pc6afRZZ7YpAu6nGL6zYIFWc685GF+DOHA7A2ZCswh45e/gu1y8Eja4Bcw5czndgE05+aO3LYY1zLc6C4JjBD6qA/j60U+FCJiieAnu4RgWx+1ri5ffGIS0Ow0DoT1embwUaxMwWBGwJU+HxaX54x8U42/QG0GcXpD8oAEeux/HGteDU00VASvztVvYWDH+Ak3hF799SS6N24brQVvugbqKAHEANTCM30NV+LYfV0cIeXFaeghGEFCNUS9DQC9egu2k8esoZn0Jdh6REge+BcyLNvdcAUbfGwIaEjD82/hxZHY27jwiHjZxHG+JvPBidkZfyAHcK40ImM3gASRXj/99RHTugcZcDxIxeksK+BR72vFKhVrOacFoXIvxvw/xoem+uLujM3pTCngrLtOd0zf1LYb/640xIRzOyscwEuD/jksBgbBTCriJaJ4M8INlUsAlRPJkgDBeCtiDIB4JkCLGSgGr4dfTAfL/BxPF1zwdkAj1UB9Z/nTc+/YZ17Y6A9knz5IAAAAASUVORK5CYII="
  },
  {
    name: "ShopSabre IS Series",
    minCost: 20000, maxCost: 30000, avgCost: 25000,
    minArea: 16, maxArea: 32,
    url: "https://www.shopsabre.com/cnc-routers/is-series",
    features: "Top-tier line with servo motors, advanced controls, heavy steel frames.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAz0lEQVR4AWMYXODj958C4jWLfwlXLfwnVLnwPyEs17DsNVzz55+/eUGCpGDVlhUv4QYUrT8+A12B98wdB/G5+MG7z0pwDjZnJyw9sPr+209KyPjF528SWE0j1flvvnwXhWued+JGJqkGTDtyrRBugN/snftJNeDn7z/scAOuvXivQ6oBRKeNqEX7NqJrDp63eydcwaLTt1LefP0h8vnHL15sWL5h2Ud0A84+em0GN0CmbulXipwvWbvku1j14l/4MCh5S9Qs/uk5Y/sRhkEHADg8SdpO5UtoAAAAAElFTkSuQmCC"
  },
  {
    name: "AXIOM Precision AR16",
    minCost: 20000, maxCost: 30000, avgCost: 25000,
    minArea: 16, maxArea: 32,
    url: "https://www.axiomprecision.com/elite-series/ar16-elite",
    features: "Elite series with steel frame, water-cooled spindle, and large capacity.",
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACxElEQVR4AWOgNrh2/Dibrq5um6am5iQQjQ0rKinNCwkI8GWgBVg6b64zkPoPwpycnH+wYZCckZHRBKpb/vzJE05eXt6XIAsIYVAIUd0Bvu4eC6AW0N8BK1es8AcbTn8HIIJ+wBwQFhwMC3r6O2DKxAkBYEPp7wBE0A+YA7w8PFdDDaS/Aya0tERADaO/A64cPsLPzMLyfsAc4O/jswKf4fx8vG+sLS330MQBs6dNDSXku4KcnLIJPT2uhBxAk6AXl5J6BFKblpYWQXUH+Pv6LSPk+xP795mC1No7O2VR1QFTJk2MJWR5cmLiNJj6ppYWY6o54Obly6JMjIxfCQU9qDEC0/Mit1y2J6+gikGQ/z3FDnB2ctpAyPdLJkx0Q9azT804821g3D1QogWlG7Id0FRcEk/I8pSq8trfqzbIbGUT2bnX2G7RPgunKXuM7Q5sZOL//8o74lB7VbU3AxPDQ3QHUCXouXl4HoPUPpmzIHI9A+f/7VLqECyn9X+HquH/7bxS/+/ZeB6tDwpLhIcEwgGUl/XQNiDDhb5JqSAf71DSQ8UaJv9B4j+d/JeBQoJoB0ybPJlg0KdGRVeBFSMcAPI5CMNDYJOw/P87Rg7PjnX3p4gqKx5HdgBFQa+qonIZohrhAGgUQCzXMAFbfllU5d2VeYtsZe1tNhKdBmysrHYQ8v22LZvtkPUc2b1b+OCkqaZH5y3UA5WYO+08Gu+oGP/f19TmxysjfZjoXNDZ0Z5JyPKEiIg+QunnVVKu+ery6nxOddUjRJcDly9ekCFkubSMzG38ViNChIWP7za+kpCCoCcMwsLDM0kqilurq9MpD3oEiIyIyCDaAUf37DEiZLmujs5JmHqqhsC0CROMvT08WkFFpbCw8GZBQcEdyBhY0u0FKju2c/VqDVIckJma6s3ExHRdQEBgJ7qZIHErC4tMhsEAACrSm6ReHjlMAAAAAElFTkSuQmCC"
  }
];
