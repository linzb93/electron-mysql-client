const apiList = [];
export const getApiList = () => apiList;

export function Route(url: string) {
  return function (
    target: any,
    propertyKey: any,
    descriptior?: TypedPropertyDescriptor<any>
  ) {
    descriptior.enumerable = true;
    const ctor = new target.constructor();
    apiList.push({
      uid: ctor.uid,
      Class: target.constructor,
      path: url,
      propertyKey,
    });
  };
}
